/**
 * Stages in Relationships — participant screen (/tools/stages-in-relationships/join/).
 *
 * Built for a phone. Join with a code and a name, then follow the
 * facilitator: order the stage cards (Stage 1), tap a column for each
 * card sent to you (Stages 2 and 3), and see the spread once the
 * facilitator reveals.
 */

import {
  $,
  ApiError,
  BASE_PATH,
  NEVER_COLUMN_ID,
  POLL_MS,
  Sortable,
  apiGet,
  apiPost,
  btn,
  cardLabel,
  clear,
  deckCards,
  el,
  loadLocal,
  removeLocal,
  saveLocal,
  shuffle,
  startPolling,
  timelineColumns,
  type PublicSession,
} from './shared';

const STORE_KEY = 'stages-join-v1';

interface StoredJoin {
  code: string;
  pid: string;
  name: string;
}

interface Me {
  id: string;
  name: string;
  stage1: { order: string[]; out: string[]; submitted: boolean } | null;
  stage2: Record<string, string>;
  stage3: Record<string, string>;
}

interface RevealTally {
  [cardId: string]: { counts: Record<string, number> };
}

interface ParticipantView {
  session: PublicSession;
  me: Me;
  stage1Reveal?: { submissions: { name: string; order: string[]; out: string[] }[] };
  stage2Reveal?: RevealTally;
  stage3Reveal?: RevealTally;
}

type PlacementStage = 'stage2' | 'stage3';

export function initJoinPage(): void {
  const root = document.querySelector<HTMLElement>('#stages-join');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';

  const main = $('#stages-join-main', root);
  const params = new URLSearchParams(location.search);
  const urlCode = (params.get('code') ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const stored = loadLocal<StoredJoin>(STORE_KEY);

  if (stored && (!urlCode || stored.code === urlCode)) {
    runParticipant(stored);
  } else {
    renderJoinForm(urlCode);
  }

  // ─────────────────────────────────────────────────────────────────
  function renderJoinForm(prefill: string, message = '') {
    clear(main);
    const codeInput = el('input', {
      class: 'form-input',
      id: 'stages-join-code',
      name: 'code',
      type: 'text',
      inputmode: 'text',
      autocomplete: 'off',
      autocapitalize: 'characters',
      spellcheck: 'false',
      maxlength: '6',
      required: true,
      value: prefill,
      placeholder: 'ABC123',
    }) as HTMLInputElement;
    const nameInput = el('input', {
      class: 'form-input',
      id: 'stages-join-name',
      name: 'name',
      type: 'text',
      autocomplete: 'given-name',
      maxlength: '24',
      required: true,
      placeholder: 'First name or nickname',
    }) as HTMLInputElement;
    const error = el('p', { class: 'stages-note', role: 'alert' }, message);
    const submit = el('button', { type: 'submit', class: 'btn btn--std btn--primary' }, 'Join') as HTMLButtonElement;
    const form = el('form', { class: 'stages-join-form stages-stack', novalidate: true },
      el('div', { class: 'form-group' },
        el('label', { class: 'form-label', for: 'stages-join-code' }, 'Session code'),
        codeInput,
      ),
      el('div', { class: 'form-group' },
        el('label', { class: 'form-label', for: 'stages-join-name' }, 'Your name'),
        nameInput,
        el('span', { class: 'stages-note' }, 'Shown to the facilitator and the group next to your answers.'),
      ),
      el('div', { class: 'stages-actions' }, submit),
      error,
    ) as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      error.textContent = '';
      const code = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const name = nameInput.value.trim();
      if (code.length !== 6) {
        error.textContent = 'The code is six letters and numbers.';
        codeInput.focus();
        return;
      }
      if (!name) {
        error.textContent = 'Please enter a name.';
        nameInput.focus();
        return;
      }
      submit.disabled = true;
      try {
        const res = await apiPost<{ pid: string; name: string; code: string }>('join', { code, name });
        const auth: StoredJoin = { code: res.code, pid: res.pid, name: res.name };
        saveLocal(STORE_KEY, auth);
        history.replaceState(null, '', `${BASE_PATH}/join/?code=${auth.code}`);
        runParticipant(auth);
      } catch (err) {
        error.textContent = err instanceof Error ? err.message : 'Could not join.';
        submit.disabled = false;
      }
    });
    main.append(form);
    (prefill ? nameInput : codeInput).focus();
  }

  // ─────────────────────────────────────────────────────────────────
  function runParticipant(auth: StoredJoin) {
    let view: ParticipantView | null = null;
    let phaseKey = '';
    let connection = '';
    let sortables: Sortable[] = [];

    // Local state for the current phase.
    let order: string[] = [];
    let out: string[] = [];
    let cursor = 0; // index into open cards
    let optimistic: Record<string, string> = {};

    const banner = el('p', { class: 'stages-note', 'aria-live': 'polite' });
    const errorLine = el('p', { class: 'stages-note', role: 'alert' });

    const poll = startPolling(
      async () => {
        view = await apiGet<ParticipantView>('session', { code: auth.code, pid: auth.pid });
        render();
      },
      POLL_MS,
      (err) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 410 || err.status === 400)) {
          poll.stop();
          removeLocal(STORE_KEY);
          renderJoinForm(auth.code, err.status === 410 ? 'You were removed from the session, or it has ended.' : 'That session has ended.');
          return;
        }
        connection = err ? 'Reconnecting…' : '';
        banner.textContent = connection;
      },
    );

    function leave() {
      poll.stop();
      removeLocal(STORE_KEY);
      renderJoinForm('');
    }

    function header(title: string, text?: string): HTMLElement {
      return el('div', { class: 'stages-section__text' },
        el('h2', { class: 'stages-section__title' }, title),
        text ? el('p', { class: 'stages-section__intro' }, text) : null,
      );
    }

    /** Re-render only when the phase changes, so drags and taps aren't
     *  interrupted by polling. Reveal data re-renders as it changes. */
    function render() {
      if (!view) return;
      const s = view.session;
      const stage = s.step === 'stage2' || s.step === 'stage3' ? s.step : null;
      const key = JSON.stringify([
        s.step,
        s.stage1,
        s.timeline,
        stage ? s[stage].open : null,
        stage ? s[stage].revealed : null,
        view.stage1Reveal ?? null,
        stage ? view[`${stage}Reveal`] ?? null : null,
        s.hideExplicit,
      ]);
      if (key === phaseKey) return;
      phaseKey = key;
      sortables.forEach((x) => x.destroy());
      sortables = [];
      clear(main);
      errorLine.textContent = '';

      main.append(
        el('div', { class: 'stages-actions' },
          el('span', { class: 'stages-note' }, `You’re in as ${auth.name} · session ${auth.code}`),
          btn('Leave', 'text', leave, { small: true }),
        ),
        banner,
      );

      switch (s.step) {
        case 'lobby':
          main.append(wait('You’re in', 'Waiting for the facilitator to start Stage 1.'));
          break;
        case 'stage1':
          if (s.stage1.revealed) main.append(renderStage1Reveal());
          else if (s.stage1.open) main.append(renderStage1());
          else main.append(wait('Stage 1', 'Waiting for the facilitator.'));
          break;
        case 'stage2':
        case 'stage3':
          main.append(renderPlacement(s.step));
          break;
        case 'end':
          main.append(wait('Thanks for taking part', 'The session has finished. You can close this page.'));
          break;
      }
      main.append(errorLine);
    }

    function wait(title: string, text: string): HTMLElement {
      return el('div', { class: 'stages-wait' },
        el('h2', { class: 'stages-wait__title' }, title),
        el('p', { class: 'stages-wait__text' }, text),
      );
    }

    // ── Stage 1: order the cards ──
    function renderStage1(): HTMLElement {
      const v = view!;
      const visible = deckCards('stages', v.session.hideExplicit).map((c) => c.id);
      if (v.me.stage1 && v.me.stage1.submitted) {
        order = v.me.stage1.order.filter((id) => visible.includes(id));
        out = v.me.stage1.out.filter((id) => visible.includes(id));
      } else if (!order.length && !out.length) {
        order = shuffle(visible);
        out = [];
      }
      // Any card missing from both lists (e.g. explicit toggle changed) goes back on.
      for (const id of visible) if (!order.includes(id) && !out.includes(id)) order.push(id);

      const wrap = el('div', { class: 'stages-stack' });
      wrap.append(header('Stage 1: put these in order', 'Drag the handle, or use the arrows. Top is the start of a relationship. If you think a card doesn’t belong on a timeline at all, move it to the bottom list.'));

      const list = el('ol', { class: 'stages-sort', 'aria-label': 'Your timeline' });
      const outList = el('ol', { class: 'stages-sort stages-sort--out', 'aria-label': 'Doesn’t belong on the timeline' });
      const outEmpty = el('li', { class: 'stages-sort__empty' }, 'Nothing here yet.');

      const item = (id: string, inOut: boolean) => {
        const li = el('li', { class: 'stages-sort__item', dataset: { cardId: id } },
          el('span', { class: 'stages-sort__pos', 'aria-hidden': 'true' }),
          el('span', { class: 'stages-sort__label' }, cardLabel(id)),
          el('button', { type: 'button', class: 'stages-sort__btn', 'aria-label': `Move ${cardLabel(id)} up`, onClick: () => move(li, -1) }, '↑'),
          el('button', { type: 'button', class: 'stages-sort__btn', 'aria-label': `Move ${cardLabel(id)} down`, onClick: () => move(li, 1) }, '↓'),
          el('button', {
            type: 'button',
            class: 'stages-sort__btn',
            'aria-label': inOut ? `Put ${cardLabel(id)} back on the timeline` : `${cardLabel(id)} doesn’t belong on the timeline`,
            title: inOut ? 'Back on the timeline' : 'Doesn’t belong',
            onClick: () => {
              li.remove();
              (inOut ? list : outList).append(item(id, !inOut));
              sync();
            },
          }, inOut ? '↩' : '×'),
          el('span', { class: 'stages-sort__handle', 'aria-hidden': 'true' }, '⋮⋮'),
        );
        return li;
      };
      const move = (li: HTMLElement, dir: -1 | 1) => {
        const sib = dir < 0 ? li.previousElementSibling : li.nextElementSibling;
        if (!sib || !sib.classList.contains('stages-sort__item')) return;
        if (dir < 0) sib.before(li);
        else sib.after(li);
        sync();
        li.querySelector<HTMLButtonElement>(dir < 0 ? 'button:nth-of-type(1)' : 'button:nth-of-type(2)')?.focus();
      };
      for (const id of order) list.append(item(id, false));
      for (const id of out) outList.append(item(id, true));
      outList.append(outEmpty);

      const sendBtn = btn(v.me.stage1?.submitted ? 'Send again' : 'Send my timeline', 'primary', async () => {
        sync();
        sendBtn.disabled = true;
        errorLine.textContent = '';
        try {
          await apiPost('respond', { code: auth.code, pid: auth.pid, stage: 'stage1', order, out });
          sent.textContent = 'Sent. You can still change it and send again until the reveal.';
          sendBtn.textContent = 'Send again';
        } catch (err) {
          errorLine.textContent = err instanceof Error ? err.message : 'Could not send.';
        } finally {
          sendBtn.disabled = false;
        }
      });
      const sent = el('p', { class: 'stages-note', 'aria-live': 'polite' }, v.me.stage1?.submitted ? 'Sent. You can still change it and send again until the reveal.' : '');

      const sync = () => {
        order = Array.from(list.querySelectorAll<HTMLElement>('[data-card-id]')).map((n) => n.dataset.cardId!);
        out = Array.from(outList.querySelectorAll<HTMLElement>('[data-card-id]')).map((n) => n.dataset.cardId!);
        outEmpty.hidden = out.length > 0;
        outList.append(outEmpty);
      };
      for (const l of [list, outList]) {
        sortables.push(new Sortable(l, {
          group: 'stage1',
          handle: '.stages-sort__handle',
          filter: '.stages-sort__empty',
          animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150,
          forceFallback: true,
          fallbackOnBody: true,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          onSort: sync,
          onAdd: sync,
          onRemove: sync,
        }));
      }
      sync();

      wrap.append(
        el('div', { class: 'stages-sort-group' },
          el('div', {}, el('h3', { class: 'stages-sort-group__label' }, 'Your timeline'), list),
          el('div', {}, el('h3', { class: 'stages-sort-group__label' }, 'Doesn’t belong on the timeline'), outList),
        ),
        el('div', { class: 'stages-actions' }, sendBtn),
        sent,
      );
      return wrap;
    }

    function renderStage1Reveal(): HTMLElement {
      const v = view!;
      const wrap = el('div', { class: 'stages-stack' });
      wrap.append(header('Stage 1: everyone’s timelines', 'Look at the shared screen for the full picture. Here’s what each person sent.'));
      const rows = el('div', { class: 'stages-reveal' });
      for (const sub of v.stage1Reveal?.submissions ?? []) {
        rows.append(
          el('div', { class: 'stages-reveal__row' },
            el('span', { class: 'stages-reveal__name' }, sub.name === auth.name ? `${sub.name} (you)` : sub.name),
            el('div', { class: 'stages-reveal__cards' },
              ...sub.order.flatMap((id, i) => [
                i > 0 ? el('span', { class: 'stages-reveal__arrow', 'aria-hidden': 'true' }, '→') : null,
                el('span', { class: 'stages-mini' }, cardLabel(id)),
              ]),
              ...sub.out.map((id) => el('span', { class: 'stages-mini stages-mini--out' }, cardLabel(id))),
            ),
          ),
        );
      }
      wrap.append(rows);
      return wrap;
    }

    // ── Stage 2 / 3: place cards ──
    function renderPlacement(stage: PlacementStage): HTMLElement {
      const v = view!;
      const s = v.session;
      const round = s[stage];
      const columns = timelineColumns(s.timeline, stage === 'stage3');
      const title = stage === 'stage2' ? 'Stage 2: when does this happen?' : 'Stage 3: sharing fluids';

      if (!round.open.length) {
        return el('div', { class: 'stages-stack' }, header(title), wait('Waiting for cards', 'The facilitator will send the next cards.'));
      }

      // Reveal
      const reveal = v[`${stage}Reveal`];
      if (round.revealed && reveal) {
        const wrap = el('div', { class: 'stages-stack' });
        wrap.append(header(title, 'Here’s where everyone put each card. Your answer is highlighted.'));
        const summary = el('div', { class: 'stages-summary' });
        for (const id of round.open) {
          const counts = reveal[id]?.counts ?? {};
          const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
          const mine = v.me[stage][id];
          const bars = el('ul', { class: 'stages-summary__bars' });
          for (const c of columns) {
            const n = counts[c.id] ?? 0;
            if (!n && c.id !== mine) continue;
            bars.append(
              el('li', { class: `stages-summary__bar${c.id === mine ? ' is-mine' : ''}` },
                el('span', {}, c.label),
                el('span', { class: 'stages-summary__fill' }, el('span', { style: `width:${Math.round((n / total) * 100)}%` })),
                el('span', {}, String(n)),
              ),
            );
          }
          summary.append(el('div', { class: 'stages-summary__item' }, el('p', { class: 'stages-summary__card' }, cardLabel(id)), bars));
        }
        wrap.append(summary);
        return wrap;
      }

      // Placing
      const placed = { ...v.me[stage], ...optimistic };
      const open = round.open;
      if (cursor >= open.length) cursor = 0;
      // Start on the first unplaced card.
      const firstUnplaced = open.findIndex((id) => !placed[id]);
      if (firstUnplaced >= 0 && !placed[open[cursor]] === false) cursor = firstUnplaced;

      const wrap = el('div', { class: 'stages-place' });
      wrap.append(header(title, stage === 'stage2'
        ? 'Tap the stage where you think this happens.'
        : 'Tap the stage where you’d be happy to do this, or “Never”.'));

      const progress = el('p', { class: 'stages-place__progress' });
      const cardBox = el('div', { class: 'stages-place__card', 'aria-live': 'polite' });
      const question = el('p', { class: 'stages-place__question' });
      const options = el('div', { class: 'stages-place__options', role: 'group' });
      const nav = el('div', { class: 'stages-place__nav' });
      const doneList = el('div', { class: 'stages-place__done' });
      wrap.append(progress, cardBox, question, options, nav, doneList);

      const paint = () => {
        const id = open[cursor];
        const placedN = open.filter((x) => placed[x]).length;
        progress.textContent = `Card ${cursor + 1} of ${open.length} · ${placedN} placed`;
        cardBox.textContent = cardLabel(id);
        question.textContent = placed[id] ? `You said: ${columns.find((c) => c.id === placed[id])?.label ?? placed[id]}` : 'Where does this belong?';
        clear(options);
        columns.forEach((c, i) => {
          const b = el('button', {
            type: 'button',
            class: `stages-option${c.kind === 'never' ? ' stages-option--never' : ''}${placed[id] === c.id ? ' is-selected' : ''}`,
            'aria-pressed': placed[id] === c.id ? 'true' : 'false',
            onClick: () => void choose(id, c.id),
          },
            c.kind === 'stage' ? el('span', { class: 'stages-option__pos', 'aria-hidden': 'true' }, String(i + 1)) : null,
            c.label,
          );
          options.append(b);
        });
        clear(nav);
        if (open.length > 1) {
          nav.append(
            btn('Previous', 'tint', () => { cursor = (cursor - 1 + open.length) % open.length; paint(); }, { small: true }),
            btn('Next', 'tint', () => { cursor = (cursor + 1) % open.length; paint(); }, { small: true }),
          );
        }
        clear(doneList);
        if (placedN === open.length) {
          doneList.append(el('p', { class: 'stages-note' }, 'All placed. You can still change any answer until the facilitator reveals.'));
        }
      };

      const choose = async (cardId: string, columnId: string) => {
        placed[cardId] = columnId;
        optimistic[cardId] = columnId;
        paint();
        errorLine.textContent = '';
        try {
          await apiPost('respond', { code: auth.code, pid: auth.pid, stage, cardId, columnId });
          // Advance to the next unplaced card after a beat.
          const next = open.findIndex((id, i) => i > cursor && !placed[id]);
          const wrapNext = next >= 0 ? next : open.findIndex((id) => !placed[id]);
          if (wrapNext >= 0) {
            window.setTimeout(() => {
              if (open[cursor] === cardId) {
                cursor = wrapNext;
                paint();
              }
            }, 450);
          }
        } catch (err) {
          delete optimistic[cardId];
          delete placed[cardId];
          paint();
          errorLine.textContent = err instanceof Error ? err.message : 'Could not save that, try again.';
        }
      };

      paint();
      return wrap;
    }
  }
}

void NEVER_COLUMN_ID;
