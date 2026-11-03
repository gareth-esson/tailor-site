export const prerender = false;

import type { APIRoute } from 'astro';
import { deckCards } from '../../../data/stages-in-relationships';
import {
  allowedColumns,
  clearPlaced,
  clearResponses,
  deleteSession,
  isValidPid,
  isValidToken,
  loadSession,
  normaliseCode,
  removeParticipant,
  saveSession,
  draftFor,
  validateDraft,
  validateTimeline,
  type PlacementStage,
  type Session,
  type Step,
} from '../../../lib/stages-store';
import { errorResponse, json, readJson, storageUnavailable } from './_shared';

/**
 * POST /api/stages/host — every facilitator action on a live session.
 *   body: { code, hostToken, action, ...params }
 *   → { session } (the updated public session) or { deleted: true }
 *
 * Actions:
 *   setHideExplicit { hideExplicit }
 *   setShowNames { showNames }  names to the group (presenter screen and phones), or "Person 1"
 *   showAverage { shown }      put the Stage 1 average on the presenter screen
 *   openStage1                 start Stage 1 (clears earlier submissions)
 *   revealStage1               show everyone's timelines
 *   setTimeline { timeline }   agree the group timeline → columns for 2 & 3
 *   setDraftTimeline { order, out }  the timeline mid-rearrange, shown
 *                                 live on the presenter screen
 *   openCards { stage, cardIds, replace? }  send cards for placement;
 *                                 replace: true is needed while cards are out
 *   reveal { stage }           show placements for the open cards
 *   placeCard { stage, cardId, columnId }  after the vote, put a card in a
 *                                 column; columnId null goes back to the vote
 *   spotlight { stage, cardId }  show where everyone put a kept card
 *                                 again; cardId null hides it
 *   closeRound { stage }       move open cards to "done"; board keeps them
 *   undoDone { stage, cardId } take a card back off the board
 *   resetStage { stage }       wipe a stage's cards and responses
 *   setStep { step }           move between screens without changing data
 *   removeParticipant { pid }
 *   end                        close the session for participants
 *   delete                     remove the session entirely
 */

const PLACEMENT_STAGES: PlacementStage[] = ['stage2', 'stage3'];
const STEPS: Step[] = ['lobby', 'stage1', 'recap1', 'stage2', 'recap2', 'stage3', 'recap3', 'end'];

function isPlacementStage(v: unknown): v is PlacementStage {
  return typeof v === 'string' && (PLACEMENT_STAGES as string[]).includes(v);
}

function publicSession(s: Session) {
  const { hostToken: _hostToken, screenToken: _screenToken, ...rest } = s;
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

  const action = typeof body.action === 'string' ? body.action : '';

  try {
    const session = await loadSession(code);
    if (!session) return json({ error: 'Session not found' }, 404);
    if (session.hostToken !== body.hostToken) return json({ error: 'Not authorised' }, 403);

    switch (action) {
      case 'setHideExplicit': {
        session.hideExplicit = body.hideExplicit === true;
        break;
      }

      case 'setShowNames': {
        session.showNames = body.showNames === true;
        break;
      }

      case 'showAverage': {
        if (!session.stage1.revealed) return json({ error: 'Reveal the timelines first' }, 409);
        session.stage1.averageShown = body.shown === true;
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
        session.stage1.draft = draftFor(session, timeline);
        break;
      }

      case 'setDraftTimeline': {
        if (!session.stage1.revealed) return json({ error: 'Reveal the timelines first' }, 409);
        const draft = validateDraft(session, body.order, body.out);
        if (!draft) return json({ error: 'Invalid timeline' }, 400);
        session.stage1.draft = draft;
        // Rearranging means the group is agreeing the timeline now, so the
        // presenter screen moves on from everyone's rows to follow it.
        session.stage1.averageShown = true;
        break;
      }

      case 'openCards': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        if (session.timeline.length < 2) {
          return json({ error: 'Agree the timeline in Stage 1 before sending cards' }, 409);
        }
        // Sending while cards are out replaces them and clears the answers
        // people have already given, so it has to be asked for explicitly.
        if (session[stage].open.length && body.replace !== true) {
          return json({ error: 'Cards are still out. Reveal them, or take them back first.' }, 409);
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
        clearPlaced(session, stage, session[stage].open);
        session[stage].open = cardIds;
        session[stage].revealed = false;
        session.step = stage;
        // New cards are the thing to look at now.
        session.spotlight = null;
        break;
      }

      case 'reveal': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        if (!session[stage].open.length) return json({ error: 'No cards are open' }, 409);
        session[stage].revealed = true;
        session.spotlight = null;
        break;
      }

      case 'placeCard': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        const round = session[stage];
        const cardId = typeof body.cardId === 'string' ? body.cardId : '';
        const inPlay = round.revealed && round.open.includes(cardId);
        if (!inPlay && !round.done.includes(cardId)) {
          return json({ error: 'Reveal the card before placing it' }, 409);
        }
        if (body.columnId === null) {
          clearPlaced(session, stage, [cardId]);
          break;
        }
        if (typeof body.columnId !== 'string' || !allowedColumns(session).has(body.columnId)) {
          return json({ error: 'Invalid column' }, 400);
        }
        session.placed ??= {};
        (session.placed[stage] ??= {})[cardId] = body.columnId;
        break;
      }

      case 'spotlight': {
        const stage = body.stage;
        if (!isPlacementStage(stage)) return json({ error: 'Invalid stage' }, 400);
        if (body.cardId === null) {
          session.spotlight = null;
          break;
        }
        if (typeof body.cardId !== 'string' || !session[stage].done.includes(body.cardId)) {
          return json({ error: 'Card is not on the board' }, 400);
        }
        session.spotlight = { stage, cardId: body.cardId };
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
        clearPlaced(session, stage, [cardId]);
        if (session.spotlight?.cardId === cardId) session.spotlight = null;
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
          clearPlaced(session, stage);
          if (session.spotlight?.stage === stage) session.spotlight = null;
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
        session.spotlight = null;
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
    return errorResponse(`host:${action}`, err);
  }
};
