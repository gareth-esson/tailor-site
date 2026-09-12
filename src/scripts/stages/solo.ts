/**
 * Stages in Relationships — single-screen mode (/tools/stages-in-relationships/play/).
 *
 * One device, drag and drop, no backend. The board is saved in
 * localStorage so a refresh mid-workshop doesn't lose it.
 *
 *   Stage 1: deal the stage cards, drag them into a timeline; cards that
 *            "don't belong" go in the out pile.
 *   Stage 2: the timeline becomes columns; drag activity cards onto it.
 *   Stage 3: same columns plus "Never"; drag the sharing-fluids cards.
 */

import {
  $,
  NEVER_COLUMN_ID,
  OUT_PILE_ID,
  Sortable,
  btn,
  cardEl,
  clear,
  deckCards,
  el,
  getCard,
  loadLocal,
  removeLocal,
  renderColumns,
  saveLocal,
  shuffle,
  timelineColumns,
  updateColumnCounts,
  type Card,
} from './shared';

const STORE_KEY = 'stages-solo-v1';

type SoloStep = 'stage1' | 'stage2' | 'stage3';

interface SoloState {
  step: SoloStep;
  hideExplicit: boolean;
  /** Stage 1 — where every stage card currently sits. */
  stage1: { deck: string[]; order: string[]; out: string[] };
  /** Stage 2/3 — cardId → columnId for cards that have been placed;
   *  `deck` is the order of the undealt pile. */
  stage2: { deck: string[]; placed: Record<string, string> };
  stage3: { deck: string[]; placed: Record<string, string> };
}

function freshState(hideExplicit = false): SoloState {
  return {
    step: 'stage1',
    hideExplicit,
    stage1: { deck: shuffle(deckCards('stages', hideExplicit).map((c) => c.id)), order: [], out: [] },
    stage2: { deck: shuffle(deckCards('activities', hideExplicit).map((c) => c.id)), placed: {} },
    stage3: { deck: shuffle(deckCards('fluids', hideExplicit).map((c) => c.id)), placed: {} },
  };
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Stage 2/3 piles are big (80+ cards). Show the top few, like a real
 *  deck, and top the pile up as cards leave it. */
const PILE_VISIBLE = 8;

const SORTABLE_BASE = {
  // Pointer-based dragging everywhere (not native HTML5 DnD): identical
  // behaviour on mouse, touch and interactive whiteboards, and it works
  // inside the horizontally scrolling board.
  forceFallback: true,
  fallbackOnBody: true,
  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  dragClass: 'sortable-drag',
  delay: 120,
  delayOnTouchOnly: true,
  touchStartThreshold: 4,
  fallbackTolerance: 3,
};

export function initSoloPage(): void {
  const root = document.querySelector<HTMLElement>('#stages-solo');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';

  let state: SoloState = loadLocal<SoloState>(STORE_KEY) ?? freshState();
  const save = () => saveLocal(STORE_KEY, state);

  const stepper = $('#stages-solo-stepper', root);
  const toolbarStatus = $('#stages-solo-status', root);
  const hideExplicitInput = $<HTMLInputElement>('#stages-solo-explicit', root);
  const resetBtn = $<HTMLButtonElement>('#stages-solo-reset', root);
  const shuffleBtn = $<HTMLButtonElement>('#stages-solo-shuffle', root);
  const stage = $('#stages-solo-stage', root);

  hideExplicitInput.checked = state.hideExplicit;
  hideExplicitInput.addEventListener('change', () => {
    // Changing the explicit filter re-deals every deck — say so.
    const ok = window.confirm(
      hideExplicitInput.checked
        ? 'Hide explicit cards? The board will be reset and re-dealt without them.'
        : 'Show explicit cards? The board will be reset and re-dealt with them included.',
    );
    if (!ok) {
      hideExplicitInput.checked = state.hideExplicit;
      return;
    }
    state = freshState(hideExplicitInput.checked);
    save();
    render();
  });

  resetBtn.addEventListener('click', () => {
    if (!window.confirm('Clear the whole board and start again?')) return;
    state = freshState(state.hideExplicit);
    removeLocal(STORE_KEY);
    save();
    render();
  });

  shuffleBtn.addEventListener('click', () => {
    if (state.step === 'stage1') state.stage1.deck = shuffle(state.stage1.deck);
    else state[state.step].deck = shuffle(state[state.step].deck);
    save();
    render();
  });

  // Live Sortable instances for the current screen; destroyed on re-render.
  let sortables: Sortable[] = [];
  const destroySortables = () => {
    sortables.forEach((s) => s.destroy());
    sortables = [];
  };

  const stageCard = (id: string): Card => getCard(id) ?? { id, label: id };

  // ─── Stepper ─────────────────────────────────────────────────────
  const STEPS: { id: SoloStep; label: string }[] = [
    { id: 'stage1', label: '1 · Timeline' },
    { id: 'stage2', label: '2 · Activities' },
    { id: 'stage3', label: '3 · Sharing fluids' },
  ];

  function renderStepper() {
    clear(stepper);
    for (const s of STEPS) {
      const item = el('button', {
        type: 'button',
        class: `stages-stepper__item${state.step === s.id ? ' is-active' : ''}`,
        'aria-current': state.step === s.id ? 'step' : undefined,
        onClick: () => goTo(s.id),
      }, s.label);
      stepper.append(el('li', {}, item));
    }
  }

  function goTo(step: SoloStep) {
    if (step !== 'stage1' && state.stage1.order.length < 2) {
      toolbarStatus.textContent = 'Put at least two stage cards on the timeline first.';
      return;
    }
    state.step = step;
    save();
    render();
  }

  // ─── Stage 1: build the timeline ─────────────────────────────────
  function renderStage1() {
    const s = state.stage1;
    const section = el('div', { class: 'stages-stack' });

    const intro = el('div', { class: 'stages-section__text' },
      el('h2', { class: 'stages-section__title' }, 'Stage 1: what order do these go in?'),
      el('p', { class: 'stages-section__intro' },
        'Drag the cards into the order a relationship moves through them. Not everyone will agree, and that is the point. Cards the group thinks don’t belong on a timeline go in the bottom pile.'),
    );

    const deckPile = el('div', { class: 'stages-deck__pile', 'aria-label': 'Cards still to place' });
    for (const id of s.deck) deckPile.append(cardEl(stageCard(id)));
    const deck = el('div', { class: 'stages-deck' },
      el('div', { class: 'stages-deck__header' },
        el('h3', { class: 'stages-deck__title' }, 'Cards'),
        el('span', { class: 'stages-deck__count', dataset: { deckCount: '' } }, `${s.deck.length} left`),
      ),
      deckPile,
    );

    const timeline = el('div', { class: 'stages-sort stages-sort--row', 'aria-label': 'Timeline' });
    for (const id of s.order) timeline.append(cardEl(stageCard(id)));
    const outPile = el('div', { class: 'stages-sort stages-sort--row stages-sort--out', 'aria-label': 'Doesn’t belong on the timeline' });
    for (const id of s.out) outPile.append(cardEl(stageCard(id)));

    const groups = el('div', { class: 'stages-sort-group' },
      el('div', {},
        el('h3', { class: 'stages-sort-group__label' }, 'The timeline'),
        el('p', { class: 'stages-sort-group__hint' }, 'Left is the start. Drag to reorder.'),
        timeline,
      ),
      el('div', {},
        el('h3', { class: 'stages-sort-group__label' }, 'Doesn’t belong on the timeline'),
        outPile,
      ),
    );

    const next = btn('Use this timeline for Stage 2', 'primary', () => goTo('stage2'));
    const actions = el('div', { class: 'stages-actions' }, next);

    section.append(intro, deck, groups, actions);
    clear(stage);
    stage.append(section);

    const sync = () => {
      s.deck = ids(deckPile);
      s.order = ids(timeline);
      s.out = ids(outPile);
      save();
      $('[data-deck-count]', deck).textContent = `${s.deck.length} left`;
      next.disabled = s.order.length < 2;
      next.classList.toggle('btn--disabled', s.order.length < 2);
    };
    for (const list of [deckPile, timeline, outPile]) {
      sortables.push(
        new Sortable(list, {
          ...SORTABLE_BASE,
          group: 'stage1',
          animation: reducedMotion() ? 0 : 150,
          onSort: sync,
          onAdd: sync,
          onRemove: sync,
        }),
      );
    }
    sync();
  }

  // ─── Stage 2 / 3: place cards on the timeline ────────────────────
  function renderPlacement(step: 'stage2' | 'stage3') {
    const s = state[step];
    const withNever = step === 'stage3';
    const deckId = step === 'stage2' ? 'activities' : 'fluids';
    const columns = timelineColumns(state.stage1.order, withNever);

    const section = el('div', { class: 'stages-stack' });
    section.append(
      el('div', { class: 'stages-section__text' },
        el('h2', { class: 'stages-section__title' },
          step === 'stage2' ? 'Stage 2: when does each of these happen?' : 'Stage 3: sharing fluids'),
        el('p', { class: 'stages-section__intro' },
          step === 'stage2'
            ? 'Drag each card onto the stage where the group thinks it belongs. Argue about it. Notice where people disagree.'
            : 'Same timeline, one extra column. Some of these will end up in “Never”. Then look at where kissing and sex landed.'),
      ),
    );

    // Deck: only the top of the pile is face up.
    const deckPile = el('div', { class: 'stages-deck__pile', 'aria-label': 'Cards still to place' });
    let hidden = s.deck.slice(PILE_VISIBLE);
    for (const id of s.deck.slice(0, PILE_VISIBLE)) {
      const card = getCard(id);
      if (card) deckPile.append(cardEl(card));
    }
    const deckCount = el('span', { class: 'stages-deck__count' });
    section.append(
      el('div', { class: 'stages-deck' },
        el('div', { class: 'stages-deck__header' },
          el('h3', { class: 'stages-deck__title' }, 'Cards'),
          deckCount,
        ),
        deckPile,
      ),
    );

    // Board
    const board = el('div', { class: 'stages-board' });
    const bodies = renderColumns(board, columns, { fill: true });
    // Stage 3 keeps the activity cards on the board, read-only, so the
    // fluids cards can be compared against them.
    if (step === 'stage3') {
      for (const [cardId, col] of Object.entries(state.stage2.placed)) {
        const body = bodies.get(col);
        const card = getCard(cardId);
        if (body && card) body.append(cardEl(card, { static: true, extraClass: 'stages-card--done stages-card--context' }));
      }
    }
    for (const [cardId, col] of Object.entries(s.placed)) {
      const body = bodies.get(col);
      const card = getCard(cardId);
      if (body && card) body.append(cardEl(card));
    }
    section.append(board);
    section.append(el('p', { class: 'stages-key' },
      el('span', { class: 'stages-key__item' }, el('span', { class: 'stages-key__swatch', 'aria-hidden': 'true' }), 'Activities'),
      step === 'stage3' ? el('span', { class: 'stages-key__item' }, el('span', { class: 'stages-key__swatch stages-key__swatch--fluids', 'aria-hidden': 'true' }), 'Sharing fluids') : null,
    ));

    const actions = el('div', { class: 'stages-actions' });
    if (step === 'stage2') actions.append(btn('Go to Stage 3', 'primary', () => goTo('stage3')));
    else actions.append(btn('Back to Stage 2', 'tint', () => goTo('stage2')));
    actions.append(btn('Edit the timeline', 'text', () => goTo('stage1')));
    section.append(actions);

    clear(stage);
    stage.append(section);

    const sync = () => {
      // Top the face-up pile back up from the hidden remainder.
      while (deckPile.querySelectorAll('[data-card-id]').length < PILE_VISIBLE && hidden.length) {
        const card = getCard(hidden.shift()!);
        if (card) deckPile.append(cardEl(card));
      }
      s.deck = [...ids(deckPile), ...hidden];
      const placed: Record<string, string> = {};
      for (const [colId, body] of bodies) for (const id of ids(body)) placed[id] = colId;
      s.placed = placed;
      save();
      const total = deckCards(deckId, state.hideExplicit).length;
      deckCount.textContent = `${s.deck.length} of ${total} left`;
      updateColumnCounts(board);
    };
    const lists = [deckPile, ...bodies.values()];
    for (const list of lists) {
      sortables.push(
        new Sortable(list, {
          ...SORTABLE_BASE,
          group: step,
          draggable: '.stages-card:not(.stages-card--context)',
          animation: reducedMotion() ? 0 : 150,
          onSort: sync,
          onAdd: sync,
          onRemove: sync,
        }),
      );
    }
    sync();

    // Cards placed in a column that no longer exists (timeline edited)
    // fall back to the deck so they aren't lost.
    const validCols = new Set(columns.map((c) => c.id));
    const orphaned = Object.entries(s.placed).filter(([, col]) => !validCols.has(col)).map(([id]) => id);
    if (orphaned.length) {
      for (const id of orphaned) {
        delete s.placed[id];
        const card = getCard(id);
        if (card) deckPile.append(cardEl(card));
      }
      sync();
    }
  }

  function ids(list: Element): string[] {
    return Array.from(list.querySelectorAll<HTMLElement>('[data-card-id]:not(.stages-card--context)')).map((n) => n.dataset.cardId!);
  }

  function render() {
    destroySortables();
    toolbarStatus.textContent = '';
    renderStepper();
    if (state.step === 'stage1') renderStage1();
    else renderPlacement(state.step);
  }

  render();
}

// Column ids referenced so the imports are used even when the never /
// out piles are rendered by shared helpers.
void NEVER_COLUMN_ID;
void OUT_PILE_ID;
