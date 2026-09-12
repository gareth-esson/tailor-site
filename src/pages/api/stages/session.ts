export const prerender = false;

import type { APIRoute } from 'astro';
import {
  NEVER_COLUMN_ID,
  createSession,
  isValidPid,
  isValidToken,
  loadParticipants,
  loadSession,
  normaliseCode,
  touchParticipant,
  type Participant,
  type PlacementStage,
  type Session,
} from '../../../lib/stages-store';
import { json, readJson, storageUnavailable } from './_shared';

/**
 * POST /api/stages/session  → create a live session (facilitator).
 *   body: { hideExplicit?: boolean }
 *   → { code, hostToken }
 *
 * GET  /api/stages/session?code=ABC123&host=<token>  → full host view
 * GET  /api/stages/session?code=ABC123&pid=<pid>     → participant view
 *
 * Both views are polled every couple of seconds, so they carry
 * everything the client needs in one round trip.
 */

/** Session fields safe to send to anyone in the session. */
function publicSession(s: Session) {
  const { hostToken: _hostToken, ...rest } = s;
  return rest;
}

/** Per-card placement counts for the given cards:
 *  { [cardId]: { [columnId]: count } } plus who placed what (host only). */
function tally(
  participants: Participant[],
  stage: PlacementStage,
  cardIds: string[],
  withNames: boolean,
) {
  const out: Record<string, { counts: Record<string, number>; names?: Record<string, string[]> }> = {};
  for (const cardId of cardIds) {
    const counts: Record<string, number> = {};
    const names: Record<string, string[]> = {};
    for (const p of participants) {
      const col = p[stage][cardId];
      if (!col) continue;
      counts[col] = (counts[col] ?? 0) + 1;
      if (withNames) (names[col] ??= []).push(p.name);
    }
    out[cardId] = withNames ? { counts, names } : { counts };
  }
  return out;
}

/** Consensus ordering from everyone's Stage 1 submissions: cards ranked
 *  by mean position; a card most people excluded goes to the out pile. */
function consensusTimeline(participants: Participant[]) {
  const submitted = participants.filter((p) => p.stage1?.submitted);
  const positions = new Map<string, number[]>();
  const outVotes = new Map<string, number>();
  for (const p of submitted) {
    p.stage1!.order.forEach((id, i) => {
      (positions.get(id) ?? positions.set(id, []).get(id)!).push(i);
    });
    for (const id of p.stage1!.out) outVotes.set(id, (outVotes.get(id) ?? 0) + 1);
  }
  const allIds = new Set<string>([...positions.keys(), ...outVotes.keys()]);
  const order: string[] = [];
  const out: string[] = [];
  const mean = (id: string) => {
    const xs = positions.get(id) ?? [];
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : Number.POSITIVE_INFINITY;
  };
  for (const id of allIds) {
    const inCount = positions.get(id)?.length ?? 0;
    const outCount = outVotes.get(id) ?? 0;
    if (outCount > inCount) out.push(id);
    else order.push(id);
  }
  order.sort((a, b) => mean(a) - mean(b));
  return { order, out, submittedCount: submitted.length };
}

export const POST: APIRoute = async ({ request }) => {
  const unavailable = storageUnavailable();
  if (unavailable) return unavailable;

  const body = await readJson(request);
  if (body instanceof Response) return body;

  const hideExplicit = body.hideExplicit === true;
  try {
    const session = await createSession(hideExplicit);
    return json({ code: session.code, hostToken: session.hostToken }, 201);
  } catch (err) {
    console.error('stages/session create failed', err);
    return json({ error: 'Could not create a session' }, 500);
  }
};

export const GET: APIRoute = async ({ url }) => {
  const code = normaliseCode(url.searchParams.get('code'));
  if (!code) return json({ error: 'Invalid code' }, 400);

  const session = await loadSession(code);
  if (!session) return json({ error: 'Session not found' }, 404);

  const host = url.searchParams.get('host');
  const pid = url.searchParams.get('pid');

  // ── Host view ──
  if (host !== null) {
    if (!isValidToken(host) || host !== session.hostToken) {
      return json({ error: 'Not authorised' }, 403);
    }
    const participants = await loadParticipants(code);
    const now = Date.now();
    return json({
      session: publicSession(session),
      participants: participants.map((p) => ({
        id: p.id,
        name: p.name,
        online: now - p.lastSeen < 30_000,
        stage1Submitted: Boolean(p.stage1?.submitted),
        stage2Placed: session.stage2.open.filter((c) => p.stage2[c]).length,
        stage3Placed: session.stage3.open.filter((c) => p.stage3[c]).length,
      })),
      stage1: {
        submissions: participants
          .filter((p) => p.stage1?.submitted)
          .map((p) => ({ name: p.name, order: p.stage1!.order, out: p.stage1!.out })),
        consensus: consensusTimeline(participants),
      },
      stage2: tally(participants, 'stage2', [...session.stage2.open, ...session.stage2.done], true),
      stage3: tally(participants, 'stage3', [...session.stage3.open, ...session.stage3.done], true),
      neverColumnId: NEVER_COLUMN_ID,
    });
  }

  // ── Participant view ──
  if (!isValidPid(pid)) return json({ error: 'Invalid participant' }, 400);
  const me = await touchParticipant(code, pid);
  if (!me) return json({ error: 'You are no longer in this session' }, 410);

  const response: Record<string, unknown> = {
    session: publicSession(session),
    me: {
      id: me.id,
      name: me.name,
      stage1: me.stage1,
      stage2: me.stage2,
      stage3: me.stage3,
    },
  };

  // Reveal data only after the host reveals.
  if (session.stage1.revealed) {
    const participants = await loadParticipants(code);
    response.stage1Reveal = {
      submissions: participants
        .filter((p) => p.stage1?.submitted)
        .map((p) => ({ name: p.name, order: p.stage1!.order, out: p.stage1!.out })),
    };
  }
  for (const stage of ['stage2', 'stage3'] as const) {
    if (session[stage].revealed && session[stage].open.length) {
      const participants = await loadParticipants(code);
      response[`${stage}Reveal`] = tally(participants, stage, session[stage].open, false);
    }
  }
  return json(response);
};
