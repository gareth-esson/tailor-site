export const prerender = false;

import type { APIRoute } from 'astro';
import {
  isValidPid,
  loadParticipant,
  loadSession,
  normaliseCode,
  saveParticipant,
  validatePlacement,
  validateStage1,
} from '../../../lib/stages-store';
import { errorResponse, json, readJson, storageUnavailable } from './_shared';

/**
 * POST /api/stages/respond — a participant submits an answer.
 *
 *   Stage 1:  { code, pid, stage: 'stage1', order: string[], out: string[] }
 *             `order` is their timeline, `out` the cards they think
 *             don't belong. Can be re-submitted until the host reveals.
 *
 *   Stage 2/3: { code, pid, stage: 'stage2' | 'stage3', cardId, columnId }
 *             One placement per call; each is saved immediately so a
 *             dropped connection loses at most one tap. Can be changed
 *             until the host reveals that round.
 *
 *   → { ok: true, version }
 */
export const POST: APIRoute = async ({ request }) => {
  const unavailable = storageUnavailable();
  if (unavailable) return unavailable;

  const body = await readJson(request);
  if (body instanceof Response) return body;

  const code = normaliseCode(body.code);
  if (!code) return json({ error: 'Invalid code' }, 400);
  if (!isValidPid(body.pid)) return json({ error: 'Invalid participant' }, 400);

  const stage = body.stage;

  try {
    const session = await loadSession(code);
    if (!session) return json({ error: 'Session not found' }, 404);
    if (session.step === 'end') return json({ error: 'This session has finished' }, 410);

    const me = await loadParticipant(code, body.pid);
    if (!me) return json({ error: 'You are no longer in this session' }, 410);

    if (stage === 'stage1') {
      if (!session.stage1.open) return json({ error: 'Stage 1 is not open' }, 409);
      if (session.stage1.revealed) return json({ error: 'Stage 1 has been revealed' }, 409);
      const valid = validateStage1(session, body.order, body.out);
      if (!valid) return json({ error: 'Invalid timeline' }, 400);
      me.stage1 = { ...valid, submitted: true };
    } else if (stage === 'stage2' || stage === 'stage3') {
      if (session[stage].revealed) return json({ error: 'This round has been revealed' }, 409);
      const valid = validatePlacement(session, stage, body.cardId, body.columnId);
      if (!valid) return json({ error: 'Invalid placement' }, 400);
      me[stage][valid.cardId] = valid.columnId;
    } else {
      return json({ error: 'Invalid stage' }, 400);
    }

    me.lastSeen = Date.now();
    await saveParticipant(code, me);
    return json({ ok: true, version: session.version });
  } catch (err) {
    return errorResponse('respond', err);
  }
};
