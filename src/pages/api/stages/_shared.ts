/**
 * Helpers shared by the /api/stages/* routes. Underscore prefix keeps
 * Astro from treating this file as a route.
 */

import { hasRedis, isStorageError } from '../../../lib/stages-store';

export const MAX_BODY_BYTES = 16 * 1024;

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export function noStore(): Response {
  return json({ error: 'Not found' }, 404);
}

/** Parse a JSON body with content-type and size gates. Returns the
 *  parsed object or a ready-to-return error Response. */
export async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ error: 'Unsupported content type' }, 415);
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: 'Request too large' }, 413);
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

/** Live sessions need shared storage. In production (Vercel) that is
 *  Redis; the in-memory fallback only works on a single long-lived dev
 *  process. Refuse rather than let a session vanish between requests. */
export function storageUnavailable(): Response | null {
  if (hasRedis()) return null;
  if (import.meta.env.DEV) return null;
  return json({ error: 'Live sessions are not available right now (storage not configured).' }, 503);
}

/** Turn a thrown error into a response: storage problems become an
 *  honest 503 the client can show, anything else a generic 500. */
export function errorResponse(context: string, err: unknown): Response {
  if (isStorageError(err)) {
    console.error(`stages/${context}: ${(err as Error).message}`);
    return json({ error: 'The live-session storage isn’t responding. Try again in a moment; if it keeps happening, tell Tailor.' }, 503);
  }
  console.error(`stages/${context} failed`, err);
  return json({ error: 'Something went wrong, please try again' }, 500);
}
