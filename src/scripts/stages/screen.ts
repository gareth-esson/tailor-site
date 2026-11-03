/**
 * Stages in Relationships — presenter screen (/tools/stages-in-relationships/screen/).
 *
 * The single view the group watches while everyone answers on their own
 * device: the facilitator opens it in a window of its own and shares
 * that window on the call (or puts it on a projector), and drives the
 * session from the control desk (/host/). It has no controls and only
 * ever shows what the whole room is allowed to see: open cards stay
 * hidden until the reveal, the Stage 1 average waits until the host
 * shows it, and people are "Person 1" and so on unless the host turns
 * names on.
 *
 * The link carries a read-only key in its fragment (#k=…), separate
 * from the host token, so the screen can open on a second device.
 */

import {
  $,
  ApiError,
  BASE_PATH,
  POLL_MS,
  apiGet,
  apiPost,
  cardEl,
  cardLabel,
  clear,
  closingMessagesEl,
  deckCards,
  el,
  getCard,
  getRecap,
  joinUrl,
  miniEl,
  loadLocal,
  placementBoard,
  qrCode,
  recapSlide,
  roundupEl,
  startPolling,
  stepLabel,
  timelineColumns,
  type CardTally,
  type PublicSession,
  type Summary,
} from './shared';

type PlacementStage = 'stage2' | 'stage3';

/** Smallest the fitted content shrinks to; past this it would be
 *  unreadable on a shared screen anyway, so it scrolls instead. */
const MIN_FIT = 0.45;

interface ScreenParticipant {
  /** Null when the host has turned names off. */
  name: string | null;
  online: boolean;
  stage1Submitted: boolean;
  stage2Placed: number;
  stage3Placed: number;
}

interface Submission {
  name: string;
  order: string[];
  out: string[];
}

interface ScreenView {
  session: PublicSession;
  showNames: boolean;
  participants: ScreenParticipant[];
  stage1: {
    submissions: Submission[];
    consensus: { order: string[]; out: string[]; submittedCount: number } | null;
    /** The host's timeline while the group agrees it, once shown. */
    draft: { order: string[]; out: string[] } | null;
  } | null;
  stage2: CardTally;
  stage3: CardTally;
  board: { stage2: Record<string, string>; stage3: Record<string, string> };
  summary: Summary | null;
}

export function initScreenPage(): void {
  const root = document.querySelector<HTMLElement>('#stages-screen');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';

  const main = $('#stages-screen-main', root);
  const status = $('#stages-screen-status', root);

  const code = (new URLSearchParams(location.search).get('code') ?? '').toUpperCase();
  const key = new URLSearchParams(location.hash.slice(1)).get('k') ?? '';
  if (!code || !key) {
    renderMessage('This presenter link is incomplete', 'Open the presenter screen again from the facilitator’s control desk.');
    return;
  }

  let view: ScreenView | null = null;
  let lastKey = '';
  // Opened from the control desk, this browser holds the host token
  // (the desk's own stored session, 'stages-host-v1'). Then clicking a
  // kept card on the board picks it out, as on the desk; anywhere else
  // the screen stays read-only.
  const desk = loadLocal<{ code: string; hostToken: string }>('stages-host-v1');
  const hostToken = desk && desk.code === code ? desk.hostToken : null;

  const poll = startPolling(async () => {
    try {
      view = await apiGet<ScreenView>('session', { code, screen: key });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 403 || err.status === 404)) {
        poll.stop();
        renderMessage(
          err.status === 404 ? 'This session has ended' : 'This presenter link isn’t valid',
          err.status === 404 ? 'Sessions are deleted after 24 hours, or when the facilitator deletes them.' : 'Open the presenter screen again from the facilitator’s control desk.',
        );
        return;
      }
      throw err;
    }
    render();
  }, POLL_MS, (err) => {
    status.textContent = err ? 'Reconnecting…' : '';
  });

  function renderMessage(title: string, text: string) {
    clear(main);
    main.append(
      el('section', { class: 'stages-cover' },
        el('h1', { class: 'stages-cover__title' }, title),
        el('p', { class: 'stages-cover__lede' }, text),
        el('a', { class: 'btn btn--std btn--tint', href: `${BASE_PATH}/` }, 'About the activity'),
      ),
    );
  }

  function render() {
    if (!view) return;
    // Only redraw when something visible changed. Online/offline only
    // shows in the lobby, so ignore it elsewhere.
    const nextKey = JSON.stringify(
      view.session.step === 'lobby'
        ? view
        : { ...view, participants: view.participants.map(({ online: _online, ...p }) => p) },
    );
    if (nextKey === lastKey) return;
    lastKey = nextKey;

    clear(main);
    main.append(topBar());
    const s = view.session;
    switch (s.step) {
      case 'lobby':
        main.append(renderLobby());
        break;
      case 'stage1':
        main.append(...(s.stage1.revealed && view.stage1 ? renderStage1Reveal(view.stage1) : renderStage1Live()));
        break;
      case 'stage2':
      case 'stage3':
        main.append(...renderPlacement(s.step));
        break;
      case 'recap1':
      case 'recap2':
      case 'recap3':
        main.append(recapSlide(getRecap(s.step, s.hideExplicit)));
        break;
      case 'end':
        main.append(...renderEnd());
        break;
    }
    fitToWindow();
  }

  // Nobody watching a shared screen can scroll it, so anything marked to
  // fit (everyone's Stage 1 rows, the agreed timeline) shrinks until it
  // ends above the bottom of the window.
  function fitToWindow() {
    const bottom = parseFloat(getComputedStyle(root!).paddingBottom) || 0;
    for (const box of main.querySelectorAll<HTMLElement>('.stages-screen__fit')) {
      const fits = (scale: number) => {
        box.style.setProperty('--stages-fit', scale.toFixed(3));
        return box.getBoundingClientRect().bottom + window.scrollY <= window.innerHeight - bottom;
      };
      if (fits(1)) continue;
      // Shrinking also narrows it, so rows rewrap: search for the largest
      // scale that fits rather than scaling by the overflow.
      let lo = MIN_FIT;
      let hi = 1;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        if (fits(mid)) lo = mid;
        else hi = mid;
      }
      fits(lo);
    }
  }
  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(fitToWindow, 150);
  });
  // The display font arriving after the first draw changes every line's
  // width, so measure again once it has.
  document.fonts.addEventListener('loadingdone', fitToWindow);

  // Where we are, and the code for anyone joining late.
  function topBar(): HTMLElement {
    const s = view!.session;
    return el('div', { class: 'stages-screen__bar' },
      el('span', { class: 'stages-screen__step' }, stepLabel(s.step)),
      s.step === 'lobby' || s.step === 'end'
        ? null
        : el('span', { class: 'stages-screen__join' }, 'Join code ', el('strong', {}, s.code)),
    );
  }

  /** Who's in, as names or (with names off) a count. */
  function people(isDone?: (p: ScreenParticipant) => boolean): HTMLElement {
    const v = view!;
    if (!v.showNames) {
      return el('p', { class: 'stages-screen__count' }, `${v.participants.length} joined`);
    }
    return el('ul', { class: 'stages-participants stages-screen__people', 'aria-label': 'Participants' },
      ...v.participants.map((p) => {
        const done = isDone ? isDone(p) : false;
        return el('li', { class: `stages-participant${p.online ? '' : ' stages-participant--offline'}${done ? ' stages-participant--done' : ''}` },
          el('span', { class: 'stages-participant__dot', 'aria-hidden': 'true' }),
          el('span', {}, p.name ?? ''),
          done ? el('span', { 'aria-label': 'done' }, '✓') : null,
        );
      }),
    );
  }

  function heading(title: string, text?: string): HTMLElement {
    return el('div', { class: 'stages-screen__heading' },
      el('h1', { class: 'stages-screen__title' }, title),
      text ? el('p', { class: 'stages-screen__lede' }, text) : null,
    );
  }

  // ── Front page: title and how to join ──
  function renderLobby(): HTMLElement {
    const s = view!.session;
    return el('div', { class: 'stages-stack' },
      el('section', { class: 'stages-cover' },
        el('p', { class: 'stages-cover__eyebrow' }, 'An activity about relationships'),
        el('h1', { class: 'stages-cover__title' }, 'Stages in Relationships'),
        el('p', { class: 'stages-cover__lede' },
          'What happens when in a relationship, and who gets to decide. Three rounds of cards, and a lot of disagreement.'),
        el('div', { class: 'stages-code-panel' },
          el('p', { class: 'stages-code-panel__label' }, 'Join on your phone or laptop with this code'),
          el('div', { class: 'stages-code-panel__join' },
            el('div', {},
              el('p', { class: 'stages-code' }, s.code),
              el('p', { class: 'stages-code-panel__url' }, joinUrl(s.code).replace(/^https?:\/\//, '')),
            ),
            qrCode(joinUrl(s.code), 'QR code: scan to join'),
          ),
        ),
      ),
      el('div', { class: 'stages-panel' },
        el('h2', { class: 'stages-panel__title' }, 'Who’s here'),
        people(),
      ),
    );
  }

  // ── Stage 1, while people are ordering ──
  function renderStage1Live(): HTMLElement[] {
    const v = view!;
    const sent = v.participants.filter((p) => p.stage1Submitted).length;
    return [
      heading('Stage 1: the timeline of a relationship',
        'On your own device, put the cards in the order you think a relationship goes. You don’t have to use every card. There’s no right answer.'),
      el('div', { class: 'stages-panel' },
        el('p', { class: 'stages-screen__count' }, `${sent} of ${v.participants.length} have sent their timeline`),
        people((p) => p.stage1Submitted),
      ),
      el('div', { class: 'stages-panel' },
        el('h2', { class: 'stages-panel__title' }, 'The cards'),
        el('div', { class: 'stages-reveal__cards' }, ...deckCards('stages', v.session.hideExplicit).map((c) => miniEl(c.id))),
      ),
    ];
  }

  // ── Stage 1 reveal: everyone's timelines, then the average ──
  function renderStage1Reveal(stage1: NonNullable<ScreenView['stage1']>): HTMLElement[] {
    // Once the facilitator starts rearranging, show her timeline as it
    // changes; until then, the average it starts from.
    const shown = stage1.draft ?? stage1.consensus;
    if (shown) {
      const editing = stage1.draft !== null;
      const row = el('ol', { class: 'stages-screen__timeline', 'aria-label': editing ? 'The group’s timeline' : 'The average timeline' });
      shown.order.forEach((id) => {
        const card = getCard(id);
        if (card) row.append(el('li', {}, cardEl(card, { static: true })));
      });
      return [
        editing
          ? heading('The group’s timeline',
              'The order we agree here becomes the columns for the next two stages.')
          : heading('The average timeline',
              'Everyone’s timelines, averaged. It’s a starting point to agree one timeline for the next stage, not the right answer.'),
        el('div', { class: 'stages-screen__fit' },
          row,
          shown.out.length
            ? el('p', { class: 'stages-screen__left-off' }, editing ? 'Left off: ' : 'Most people left off: ', ...shown.out.map((id) => miniEl(id, 'stages-mini--out')))
            : null,
        ),
      ];
    }
    const rows = el('div', { class: 'stages-reveal stages-screen__reveal stages-screen__fit' });
    for (const sub of stage1.submissions) {
      rows.append(
        el('div', { class: 'stages-reveal__row' },
          el('span', { class: 'stages-reveal__name' }, sub.name),
          el('div', { class: 'stages-reveal__cards' },
            ...sub.order.flatMap((id, i) => [
              i > 0 ? el('span', { class: 'stages-reveal__arrow', 'aria-hidden': 'true' }, '→') : null,
              miniEl(id),
            ]),
            // The cards they left off are only counted: listing them all
            // took more room than the timeline itself.
            sub.out.length ? el('span', { class: 'stages-note' }, `${sub.out.length} left off`) : null,
          ),
        ),
      );
    }
    return [
      heading('Everyone’s timelines', 'One row per person, in their order, with how many cards they left off.'),
      rows,
    ];
  }

  // ── Stages 2 and 3: the card in play, and the board ──
  function renderPlacement(stage: PlacementStage): HTMLElement[] {
    const v = view!;
    const s = v.session;
    const round = s[stage];
    const tally = v[stage];
    const out: HTMLElement[] = [
      heading(
        stage === 'stage2' ? 'Stage 2: when does this happen?' : 'Stage 3: sharing fluids',
        stage === 'stage2'
          ? 'On your own device, put each card at the stage on our timeline where you think it happens, or in “Never”.'
          : 'Same columns. Put each card where you’d be happy to do this, or in “Never”.',
      ),
    ];

    if (round.open.length) {
      const placed = v.participants.filter((p) => (stage === 'stage2' ? p.stage2Placed : p.stage3Placed) >= round.open.length).length;
      const panel = el('div', { class: `stages-screen__play stages-screen__play--${stage === 'stage2' ? 'activities' : 'fluids'}` },
        el('p', { class: 'stages-screen__play-label' }, round.revealed ? 'Where everyone put it' : 'In play'),
        el('ul', { class: 'stages-screen__play-cards' }, ...round.open.map((id) => el('li', {}, cardLabel(id)))),
        round.revealed
          ? null
          : el('p', { class: 'stages-screen__count' }, `${placed} of ${v.participants.length} have placed ${round.open.length === 1 ? 'it' : 'them all'}`),
      );
      out.push(panel);

      if (round.revealed && v.showNames) {
        const columns = timelineColumns(s.timeline);
        const who = el('div', { class: 'stages-screen__who' });
        for (const id of round.open) {
          const names = tally[id]?.names;
          if (!names) continue;
          if (round.open.length > 1) who.append(el('p', { class: 'stages-summary__card' }, cardLabel(id)));
          for (const c of columns) {
            if (names[c.id]?.length) who.append(el('p', { class: 'stages-note' }, el('strong', {}, `${c.label}: `), names[c.id].join(', ')));
          }
        }
        if (who.childElementCount) out.push(who);
      }
    }

    out.push(...placementBoard({
      stage,
      timeline: s.timeline,
      round,
      tally,
      stage2Board: v.board.stage2,
      placed: s.placed?.[stage],
      spotlight: s.spotlight?.stage === stage ? s.spotlight.cardId : null,
      onPick: hostToken
        ? (cardId) => {
            const again = s.spotlight?.stage === stage && s.spotlight.cardId === cardId;
            void apiPost('host', { code, hostToken, action: 'spotlight', stage, cardId: again ? null : cardId })
              .then(() => poll.now())
              .catch(() => undefined);
          }
        : undefined,
    }));
    return out;
  }

  // ── Closing page ──
  function renderEnd(): HTMLElement[] {
    const v = view!;
    const out: HTMLElement[] = [
      el('section', { class: 'stages-cover stages-cover--end' },
        el('p', { class: 'stages-cover__eyebrow' }, 'That’s the activity'),
        el('h1', { class: 'stages-cover__title' }, 'Three things worth taking away'),
        closingMessagesEl(),
      ),
    ];
    if (v.summary) out.push(roundupEl(v.summary));
    return out;
  }
}
