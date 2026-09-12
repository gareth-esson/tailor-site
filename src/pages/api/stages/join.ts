export const prerender = false;

import type { APIRoute } from 'astro';
import {
  addParticipant,
  cleanName,
  loadSession,
  normaliseCode,
} from '../../../lib/stages-store';
import { errorResponse, json, readJson, storageUnavailable } from './_shared';

/**
 * POST /api/stages/join — a participant joins a live session.
 *   body: { code, name }
 *   → { pid, name, code }
 *
 * The returned `pid` is the participant's identity for the rest of the
 * session (stored in their browser). Names are display-only and are
 * not required to be unique.
 */
export const POST: APIRoute = async ({ request }) => {
  const unavailable = storageUnavailable();
  if (unavailable) return unavailable;

  const body = await readJson(request);
  if (body instanceof Response) return body;

  const code = normaliseCode(body.code);
  if (!code) return json({ error: 'That code doesn’t look right. Codes are six letters and numbers.' }, 400);

  const name = cleanName(body.name);
  if (!name) return json({ error: 'Please enter a name (a first name or nickname is fine).' }, 400);

  try {
    const session = await loadSession(code);
    if (!session) return json({ error: 'No session found with that code. Check it with your facilitator.' }, 404);
    if (session.step === 'end') return json({ error: 'That session has finished.' }, 410);

    const participant = await addParticipant(code, name);
    if (participant === 'full') return json({ error: 'This session is full.' }, 409);
    return json({ pid: participant.id, name: participant.name, code }, 201);
  } catch (err) {
    return errorResponse('join', err);
  }
};
