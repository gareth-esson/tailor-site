export const prerender = false;

import type { APIRoute } from 'astro';
import { deckCards } from '../../../data/stages-in-relationships';
import {
  clearResponses,
  deleteSession,
  isValidPid,
  isValidToken,
  loadSession,
  normaliseCode,
  removeParticipant,
  saveSession,
  validateTimeline,
  type PlacementStage,
  type Session,
  type Step,
} from '../../../lib/stages-store';
import { json, readJson, storageUnavailable } from './_shared';

/**
 * POST /api/stages/host — every facilitator action on a live session.
 *   body: { code, hostToken, action, ...params }
 *   → { session } (the updated public session) or { deleted: true }
 *
 * Actions:
 *   setHideExplicit { hideExplicit }
 *   openStage1                 start Stage 1 (clears earlier submissions)
 *   revealStage1               show everyone's timelines
 *   setTimeline { timeline }   agree the group timeline → columns for 2 & 3
 *   openCards { stage, cardIds }  send cards for placement (replaces open set)
 *   reveal { stage }           show placements for the open cards
 *   closeRound { stage }       move open cards to "done"; board keeps them
 *   undoDone { stage, cardId } take a card back off the board
 *   resetStage { stage }       wipe a stage's cards and responses
 *   setStep { step }           move between screens without changing data
 *   removeParticipant { pid }
 *   end                        close the session for participants
 *   delete                     remove the session entirely
 */

const PLACEMENT_STAGES: PlacementStage[] = ['stage2', 'stage3'];
const STEPS: Step[] = ['lobby', 'stage1', 'stage2', 'stage3', 'end'];

function isPlacementStage(v: unknown): v is PlacementStage {
  return typeof v === 'string' && (PLACEMENT_STAGES as string[]).includes(v);
}

function publicSession(s: Session) {
  const { hostToken: _hostToken, ...rest } = s;
  return rest;
}

export const POST: APIRoute = async ({ request }) => {
  const unavailable = storageUnavailable();
  if (unavailable) return unavailable;

  const body = await readJson(request);
  if (body instanceof Response) return body;

  const code = normaliseCode(body.code);
  if (!code) return json({ error: 'Invalid code' }, 400);
  if (!isValidToken(body.hostToken)) return json({ error: 'Not authorised' }, 403);

  const session = await loadSession(code);
  if (!session) return json({ error: 'Session not found' }, 404);
  if (session.hostToken !== body.hostToken) return json({ error: 'Not authorised' }, 403);

  const action = typeof body.action === 'string' ? body.action : '';

  try {
    switch (action) {
      case 'setHideExplicit': {
        session.hideExplicit = body.hideExplicit === true;
        break;
      }

      case 'openStage1': {
        await clearResponses(code, 'stage1');
        session.stage1 = { open: true, revealed: false };
        session.step = 'stage1';
        break;
      }

      case 'revealStage1': {
        session.stage1.revealed = true;
        session.stage1.open = false;
        break;
      }

      case 'setTimeline': {
        const timeline = validateTimeline(session, body.timeline);
        if (!timeline) return json({ error: 'Invalid timeline' }, 400);
        session.timeline = timeline;
        break;
      }

      case 'openCards': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        if (session.timeline.length < 2) {
          return json({ error: 'Agree the timeline in Stage 1 before sending cards' }, 409);
        }
        const raw = body.cardIds;
        if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) {
          return json({ error: 'Send between 1 and 20 cards' }, 400);
        }
        const deck = stage === 'stage2' ? 'activities' : 'fluids';
        const visible = new Set(deckCards(deck, session.hideExplicit).map((c) => c.id));
        const done = new Set(session[stage].done);
        const cardIds: string[] = [];
        for (const id of raw) {
          if (typeof id !== 'string' || !visible.has(id) || done.has(id) || cardIds.includes(id)) {
            return json({ error: 'Invalid card selection' }, 400);
          }
          cardIds.push(id);
        }
        // Cards that were open but not closed are being replaced: drop
        // their responses so a re-send starts clean.
        const dropped = session[stage].open.filter((id) => !cardIds.includes(id));
        if (dropped.length) await clearResponses(code, stage, dropped);
        session[stage].open = cardIds;
        session[stage].revealed = false;
        session.step = stage;
        break;
      }

      case 'reveal': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        if (!session[stage].open.length) return json({ error: 'No cards are open' }, 409);
        session[stage].revealed = true;
        break;
      }

      case 'closeRound': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        session[stage].done.push(...session[stage].open);
        session[stage].open = [];
        session[stage].revealed = false;
        break;
      }

      case 'undoDone': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        const cardId = body.cardId;
        if (typeof cardId !== 'string' || !session[stage].done.includes(cardId)) {
          return json({ error: 'Card is not on the board' }, 400);
        }
        session[stage].done = session[stage].done.filter((id) => id !== cardId);
        await clearResponses(code, stage, [cardId]);
        break;
      }

      case 'resetStage': {
        const stage = body.stage;
        if (stage === 'stage1') {
          await clearResponses(code, 'stage1');
          session.stage1 = { open: false, revealed: false };
        } else if (isPlacementStage(stage)) {
          await clearResponses(code, stage);
          session[stage] = { open: [], revealed: false, done: [] };
        } else {
          return json({ error: 'Invalid stage' }, 400);
        }
        break;
      }

      case 'setStep': {
        const step = body.step;
        if (typeof step !== 'string' || !(STEPS as string[]).includes(step)) {
          return json({ error: 'Invalid step' }, 400);
        }
        session.step = step as Step;
        break;
      }

      case 'removeParticipant': {
        if (!isValidPid(body.pid)) return json({ error: 'Invalid participant' }, 400);
        await removeParticipant(code, body.pid);
        break;
      }

      case 'end': {
        session.step = 'end';
        break;
      }

      case 'delete': {
        await deleteSession(code);
        return json({ deleted: true });
      }

      default:
        return json({ error: 'Unknown action' }, 400);
    }

    await saveSession(session);
    return json({ session: publicSession(session) });
  } catch (err) {
    console.error('stages/host action failed', action, err);
    return json({ error: 'Something went wrong, please try again' }, 500);
  }
};
