/**
 * Helpers shared by the /api/studio/* routes. Underscore prefix keeps
 * Astro from treating this file as a route.
 */

import { isConfigured, sessionFromRequest } from '../../../lib/studio/auth';
import { GitHubError } from '../../../lib/studio/github';

export const MAX_BODY_BYTES = 256 * 1024;

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      // Editor responses carry unpublished drafts; they must never sit
      // in a shared cache or the browser's back-forward cache.
      'Cache-Control': 'no-store, private',
      ...headers,
    },
  });
}

/** Gate every editor route. Returns a Response to send back, or null
 *  when the caller may proceed. */
export function requireSession(request: Request): Response | null {
  if (!isConfigured()) {
    return json({ error: 'The editor is not configured on this deployment yet.' }, 503);
  }
  if (!sessionFromRequest(request)) {
    return json({ error: 'Your session has expired. Sign in again.' }, 401);
  }
  return null;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ error: 'Unsupported content type' }, 415);
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: 'That post is larger than the editor accepts.' }, 413);
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return json({ error: 'Invalid JSON' }, 400);
    }
    return parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
}

/** Turn a thrown error into a response. GitHub problems keep their own
 *  status and wording (the 409 conflict message is meant for the
 *  editor's user); anything else becomes a generic 500 so internals
 *  don't leak into the browser. */
export function errorResponse(context: string, err: unknown): Response {
  if (err instanceof GitHubError) {
    console.error(`studio/${context}: ${err.message}`);
    return json({ error: err.message }, err.status >= 400 && err.status < 600 ? err.status : 502);
  }
  console.error(`studio/${context}:`, err);
  return json({ error: 'Something went wrong saving that. Try again in a moment.' }, 500);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}
