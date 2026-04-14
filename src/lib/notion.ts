import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

/**
 * Query all pages from a Notion data source, handling pagination.
 * In Notion SDK v5, databases.query moved to dataSources.query.
 */
export async function queryDatabase(
  dataSourceId: string,
  filter?: Record<string, unknown>,
  sorts?: Record<string, unknown>[],
): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await retryWithBackoff(() =>
      notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: filter as any,
        sorts: sorts as any,
        start_cursor: cursor,
        page_size: 100,
      }),
    );

    for (const page of response.results) {
      if ('properties' in page) {
        pages.push(page as PageObjectResponse);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

/**
 * Fetch all child blocks for a page (the page body content), handling pagination.
 */
export async function fetchPageBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await retryWithBackoff(() =>
      notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      }),
    );

    for (const block of response.results) {
      if ('type' in block) {
        blocks.push(block as BlockObjectResponse);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Retry a function with exponential backoff for transient Notion / network
 * failures. Retries on:
 *
 *   - rate_limited (Notion's dedicated rate-limit code)
 *   - HTTP 429 (same concept, different SDK shape)
 *   - HTTP 5xx (500, 502, 503, 504 — Notion gateway/server hiccups)
 *   - Notion SDK typed errors: APIResponseError with service_unavailable,
 *     internal_server_error, bad_gateway, gateway_timeout; plus
 *     RequestTimeoutError.
 *   - Low-level fetch failures: EAI_AGAIN, ETIMEDOUT, ECONNRESET,
 *     ECONNREFUSED, ENETUNREACH, AbortError, or a "fetch failed"
 *     message from undici.
 *
 * Non-retriable errors (unauthorized, validation_error, 404, etc.)
 * bubble up immediately so real bugs are visible in the build log.
 *
 * Backoff: base 3s × 2^attempt with ±25% jitter, capped at 60s.
 * Max 10 attempts — at worst about 5 minutes of retry before giving up,
 * which is well within a Vercel build's time budget.
 */
function isRetriableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
    cause?: { code?: string; message?: string };
  };

  // HTTP status-based (Notion SDK surfaces these on the error object)
  if (err.status === 429) return true;
  if (typeof err.status === 'number' && err.status >= 500 && err.status < 600) {
    return true;
  }

  // Notion SDK string codes
  const retriableCodes = new Set([
    'rate_limited',
    'internal_server_error',
    'service_unavailable',
    'bad_gateway',
    'gateway_timeout',
    'conflict_error', // rare, but usually transient on heavy concurrent reads
  ]);
  if (err.code && retriableCodes.has(err.code)) return true;

  // SDK typed error class names
  if (err.name === 'RequestTimeoutError') return true;
  if (err.name === 'AbortError') return true;

  // Low-level network errors surface either on .code or on .cause.code
  // (undici wraps the real error in a `cause`), and sometimes only in
  // the message string.
  const networkCodes = new Set([
    'EAI_AGAIN',
    'ETIMEDOUT',
    'ECONNRESET',
    'ECONNREFUSED',
    'ENETUNREACH',
    'UND_ERR_SOCKET',
  ]);
  if (err.code && networkCodes.has(err.code)) return true;
  if (err.cause?.code && networkCodes.has(err.cause.code)) return true;

  const msg = (err.message || '') + ' ' + (err.cause?.message || '');
  if (/fetch failed|network timeout|socket hang up/i.test(msg)) return true;

  return false;
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 10,
  baseDelay = 3000,
  maxDelay = 60_000,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isLastAttempt = attempt === maxRetries;
      const retriable = isRetriableError(error);

      if (!retriable || isLastAttempt) {
        throw error;
      }

      // Exponential backoff with jitter, capped at maxDelay.
      const exp = baseDelay * Math.pow(2, attempt);
      const capped = Math.min(exp, maxDelay);
      const jittered = capped * (0.75 + Math.random() * 0.5); // ±25% jitter
      const delay = Math.round(jittered);

      const errDescriptor = (() => {
        const e = error as { code?: string; status?: number; name?: string; message?: string };
        return e.code || e.status || e.name || e.message || 'unknown';
      })();
      console.warn(
        `Notion API transient failure (${errDescriptor}); retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})…`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Unreachable');
}

// --- Property extraction helpers ---
// All helpers handle undefined/missing properties gracefully.

type NotionProperty = PageObjectResponse['properties'][string] | undefined;

export function getRichTextValue(property: NotionProperty): string {
  if (!property) return '';
  if (property.type === 'rich_text' && Array.isArray(property.rich_text)) {
    return property.rich_text.map((t) => t.plain_text).join('');
  }
  return '';
}

export function getTitleValue(property: NotionProperty): string {
  if (!property) return '';
  if (property.type === 'title' && Array.isArray(property.title)) {
    return property.title.map((t) => t.plain_text).join('');
  }
  return '';
}

export function getSelectValue(property: NotionProperty): string | null {
  if (!property) return null;
  if (property.type === 'select' && property.select) {
    return property.select.name;
  }
  return null;
}

export function getMultiSelectValues(property: NotionProperty): string[] {
  if (!property) return [];
  if (property.type === 'multi_select' && Array.isArray(property.multi_select)) {
    return property.multi_select.map((s) => s.name);
  }
  return [];
}

export function getRelationIds(property: NotionProperty): string[] {
  if (!property) return [];
  if (property.type === 'relation' && Array.isArray(property.relation)) {
    return property.relation.map((r) => r.id);
  }
  return [];
}

export function getCheckboxValue(property: NotionProperty): boolean {
  if (!property) return false;
  if (property.type === 'checkbox') {
    return property.checkbox;
  }
  return false;
}

export function getNumberValue(property: NotionProperty): number | null {
  if (!property) return null;
  if (property.type === 'number') {
    return property.number;
  }
  return null;
}
