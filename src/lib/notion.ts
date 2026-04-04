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
 * Retry a function with exponential backoff for Notion rate limits.
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isRateLimit =
        error instanceof Object &&
        'status' in error &&
        (error as { status: number }).status === 429;
      const isLastAttempt = attempt === maxRetries;

      if (!isRateLimit || isLastAttempt) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Rate limited by Notion API, retrying in ${delay}ms...`);
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
