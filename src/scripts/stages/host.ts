/**
 * Stages in Relationships — facilitator screen (/tools/stages-in-relationships/host/).
 *
 * The host creates a session (or resumes one from localStorage), shares
 * this screen over video or a projector, and drives the three stages.
 * Everything renders from the polled host view; local UI state (picked
 * cards, an in-progress timeline edit) survives re-renders.
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
  cardEl,
  cardLabel,
  clear,
  columnLabel,
  copyText,
  deckCards,
  el,
  getCard,
  joinUrl,
  loadLocal,
  majority,
  miniEl,
  closingMessagesEl,
  getRecap,
  isRecapId,
  recapSlide,
  removeLocal,
  roundupEl,
  type RecapId,
  type Summary,
  renderColumns,
  saveLocal,
  shuffle,
  timelineColumns,
  updateColumnCounts,
  type PublicSession,
  type Step,
} from './shared';

const STORE_KEY = 'stages-host-v1';

interface StoredHost {
  code: string;
  hostToken: string;
}

interface HostParticipant {
  id: string;
  name: string;
  online: boolean;
  stage1Submitted: boolean;
  stage2Placed: number;
  stage3Placed: number;
}

interface Tally {
  [cardId: string]: { counts: Record<string, number>; names?: Record<string, string[]> };
}

interface Submission {
  name: string;
  order: string[];
  out: string[];
}

interface HostView {
  session: PublicSession;
  participants: HostParticipant[];
  stage1: { submissions: Submission[]; consensus: { order: string[]; out: string[]; submittedCount: number } };
  stage2: Tally;
  stage3: Tally;
  board: { stage2: Record<string, string>; stage3: Record<string, string> };
  summary: Summary;
}

type PlacementStage = 'stage2' | 'stage3';

export function initHostPage(): void {
  const root = document.querySelector<HTMLElement>('#stages-host');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';

  const toolbar = $('#stages-host-toolbar', root);
  const main = $('#stages-host-main', root);

  const params = new URLSearchParams(location.search);
  const urlCode = (params.get('code') ?? '').toUpperCase();
  const stored = loadLocal<StoredHost>(STORE_KEY);

  // ── Which session? ──
  if (!urlCode && stored) {
    location.replace(`${BASE_PATH}/host/?code=${stored.code}`);
    return;
  }
  if (!urlCode) {
    renderCreate();
    return;
  }
  if (!stored || stored.code !== urlCode) {
    renderNotHost(urlCode, stored);
    return;
  }
  runSession(stored);

  // ─────────────────────────────────────────────────────────────────
  // Create a session
  // ─────────────────────────────────────────────────────────────────
  function renderCreate() {
    clear(main);
    const hide = el('input', { type: 'checkbox', id: 'stages-create-explicit' }) as HTMLInputElement;
    const error = el('p', { class: 'stages-note', role: 'alert' });
    const start = btn('Start a live session', 'primary', async () => {
      start.disabled = true;
      error.textContent = '';
      try {
        const res = await apiPost<{ code: string; hostToken: string }>('session', { hideExplicit: hide.checked });
        saveLocal(STORE_KEY, { code: res.code, hostToken: res.hostToken } satisfies StoredHost);
        location.replace(`${BASE_PATH}/host/?code=${res.code}`);
      } catch (err) {
        error.textContent = err instanceof Error ? err.message : 'Could not start a session.';
        start.disabled = false;
      }
    });
    main.append(
      el('div', { class: 'stages-panel stages-join-form' },
        el('h2', { class: 'stages-panel__title' }, 'Host a live session'),
        el('p', { class: 'stages-panel__text' },
          'You get a six-character code to share. Everyone joins on their own phone or laptop, you share this screen, and you decide when each stage is revealed. Sessions are deleted after 24 hours.'),
        el('label', { class: 'form-check' }, hide, ' Hide the explicit cards (younger or SEND groups)'),
        el('div', { class: 'stages-actions' }, start),
        error,
      ),
    );
  }

  function renderNotHost(code: string, other: StoredHost | null) {
    clear(main);
    main.append(
      el('div', { class: 'stages-panel stages-join-form' },
        el('h2', { class: 'stages-panel__title' }, 'This browser isn’t running that session'),
        el('p', { class: 'stages-panel__text' },
          `Session ${code} was started in a different browser. The facilitator controls only live where the session was created.`),
        el('div', { class: 'stages-actions' },
          other
            ? el('a', { class: 'btn btn--std btn--primary', href: `${BASE_PATH}/host/?code=${other.code}` }, `Go to your session ${other.code}`)
            : el('a', { class: 'btn btn--std btn--primary', href: `${BASE_PATH}/host/` }, 'Start a new session'),
          el('a', { class: 'btn btn--std btn--tint', href: `${BASE_PATH}/join/?code=${code}` }, 'Join as a participant instead'),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // Run a session
  // ─────────────────────────────────────────────────────────────────
  function runSession(auth: StoredHost) {
    let view: HostView | null = null;
    let lastKey = '';
    let busy = false;
    let errorText = '';
    let connectionText = '';

    // Local UI state that must survive re-renders.
    const picked: Record<PlacementStage, Set<string>> = { stage2: new Set(), stage3: new Set() };
    let editTimeline: { order: string[]; out: string[] } | null = null;
    let showPicker = false;
    let sortables: Sortable[] = [];

    const status = el('p', { class: 'stages-toolbar__status', 'aria-live': 'polite' });
    const errorLine = el('p', { class: 'stages-note', role: 'alert' });

    const poll = startHostPolling();

    function startHostPolling() {
      let stopped = false;
      let timer: number | undefined;
      const tick = async () => {
        if (stopped) return;
        try {
          const next = await apiGet<HostView>('session', { code: auth.code, host: auth.hostToken });
          view = next;
          connectionText = '';
          render();
        } catch (err) {
          if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
            removeLocal(STORE_KEY);
            stopped = true;
            renderGone(err.message);
            return;
          }
          connectionText = 'Reconnecting…';
          renderStatus();
        } finally {
          if (!stopped) timer = window.setTimeout(tick, document.hidden ? POLL_MS * 4 : POLL_MS);
        }
      };
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !stopped) {
          window.clearTimeout(timer);
          void tick();
        }
      });
      void tick();
      return {
        now: () => {
          window.clearTimeout(timer);
          return tick();
        },
        stop: () => {
          stopped = true;
          window.clearTimeout(timer);
        },
      };
    }

    async function act(action: string, extra: Record<string, unknown> = {}): Promise<boolean> {
      if (busy) return false;
      busy = true;
      errorText = '';
      renderStatus();
      try {
        const res = await apiPost<{ session?: PublicSession; deleted?: boolean }>('host', {
          code: auth.code,
          hostToken: auth.hostToken,
          action,
          ...extra,
        });
        if (res.deleted) {
          removeLocal(STORE_KEY);
          poll.stop();
          renderGone('Session deleted.');
          return true;
        }
        await poll.now();
        return true;
      } catch (err) {
        errorText = err instanceof Error ? err.message : 'That didn’t work, try again.';
        return false;
      } finally {
        busy = false;
        renderStatus();
      }
    }

    function renderGone(message: string) {
      clear(toolbar);
      clear(main);
      main.append(
        el('div', { class: 'stages-panel stages-join-form' },
          el('h2', { class: 'stages-panel__title' }, 'Session ended'),
          el('p', { class: 'stages-panel__text' }, message),
          el('div', { class: 'stages-actions' },
            el('a', { class: 'btn btn--std btn--primary', href: `${BASE_PATH}/host/` }, 'Start a new session'),
            el('a', { class: 'btn btn--std btn--tint', href: `${BASE_PATH}/` }, 'Back to the tool'),
          ),
        ),
      );
    }

    function renderStatus() {
      if (!view) return;
      const online = view.participants.filter((p) => p.online).length;
      const parts = [`${view.participants.length} joined`, online !== view.participants.length ? `${online} online` : null, connectionText || null]
        .filter(Boolean)
        .join(' · ');
      status.textContent = parts;
      errorLine.textContent = errorText;
      errorLine.hidden = !errorText;
      for (const b of toolbar.querySelectorAll<HTMLButtonElement>('button')) b.disabled = busy && !b.dataset.always;
    }

    // ── Render root ──
    function render() {
      if (!view) return;
      // Skip the expensive re-render when nothing changed (polling).
      // Online/offline flips only matter visually in the lobby; elsewhere
      // they go through renderStatus() so buttons don't re-render under
      // the facilitator's cursor.
      const key = JSON.stringify(
        view.session.step === 'lobby'
          ? view
          : { ...view, participants: view.participants.map(({ online: _online, ...p }) => p) },
      );
      if (key === lastKey) {
        renderStatus();
        return;
      }
      lastKey = key;
      sortables.forEach((s) => s.destroy());
      sortables = [];

      renderToolbar();
      clear(main);
      const s = view.session;
      switch (s.step) {
        case 'lobby':
          main.append(renderLobby());
          break;
        case 'stage1':
          main.append(s.stage1.revealed ? renderStage1Reveal() : renderStage1Live());
          break;
        case 'stage2':
        case 'stage3':
          main.append(renderPlacement(s.step));
          break;
        case 'recap1':
        case 'recap2':
        case 'recap3':
          main.append(renderRecap(s.step));
          break;
        case 'end':
          main.append(renderEnd());
          break;
      }
      main.append(errorLine);
      renderStatus();
    }

    // ── Toolbar: stepper + code + status ──
    function renderToolbar() {
      if (!view) return;
      const s = view.session;
      clear(toolbar);
      const steps: { id: Step; label: string; enabled: boolean }[] = [
        { id: 'lobby', label: 'Welcome', enabled: true },
        { id: 'stage1', label: '1 · Timeline', enabled: true },
        { id: 'stage2', label: '2 · Activities', enabled: s.timeline.length >= 2 },
        { id: 'stage3', label: '3 · Sharing fluids', enabled: s.timeline.length >= 2 },
        { id: 'end', label: 'Roundup', enabled: true },
      ];
      // A section break lights up the stage it belongs to.
      const onStep = isRecapId(s.step) ? getRecap(s.step).stage : s.step;
      const stepper = el('ol', { class: 'stages-stepper', 'aria-label': 'Stages' });
      for (const st of steps) {
        stepper.append(
          el('li', {},
            el('button', {
              type: 'button',
              class: `stages-stepper__item${onStep === st.id ? ' is-active' : ''}`,
              'aria-current': onStep === st.id ? 'step' : undefined,
              disabled: !st.enabled,
              title: st.enabled ? undefined : 'Agree a timeline in Stage 1 first',
              onClick: () => {
                if (st.id === 'stage1' && !s.stage1.open && !s.stage1.revealed) void act('openStage1');
                else void act('setStep', { step: st.id });
              },
            }, st.label),
          ),
        );
      }
      const code = el('div', { class: 'stages-toolbar__group' },
        el('span', { class: 'stages-note' }, 'Join code '),
        el('strong', { class: 'stages-toolbar__code' }, s.code),
        btn('Copy join link', 'text', async () => {
          const ok = await copyText(joinUrl(s.code));
          status.textContent = ok ? 'Join link copied.' : joinUrl(s.code);
        }, { small: true }),
      );
      toolbar.append(stepper, code, el('div', { class: 'stages-toolbar__spacer' }), status);
    }

    // ── Shared bits ──
    function codePanel(compact = false): HTMLElement {
      const s = view!.session;
      const url = joinUrl(s.code);
      return el('div', { class: 'stages-code-panel' },
        el('p', { class: 'stages-code-panel__label' }, compact ? 'Join code' : 'Join with this code'),
        el('p', { class: 'stages-code' }, s.code),
        el('p', { class: 'stages-code-panel__url' }, url.replace(/^https?:\/\//, '')),
        el('div', { class: 'stages-code-panel__actions' },
          btn('Copy join link', 'tint', async () => {
            const ok = await copyText(url);
            status.textContent = ok ? 'Join link copied.' : 'Copy failed, share the address above.';
          }, { small: true }),
          el('a', { class: 'btn btn--sm btn--text', href: url, target: '_blank', rel: 'noopener' }, 'Open join page'),
        ),
      );
    }

    function participantsList(doneFor?: (p: HostParticipant) => boolean): HTMLElement {
      const list = el('ul', { class: 'stages-participants', 'aria-label': 'Participants' });
      for (const p of view!.participants) {
        const done = doneFor ? doneFor(p) : false;
        list.append(
          el('li', { class: `stages-participant${p.online ? '' : ' stages-participant--offline'}${done ? ' stages-participant--done' : ''}` },
            el('span', { class: 'stages-participant__dot', 'aria-hidden': 'true' }),
            el('span', {}, p.name),
            done ? el('span', { 'aria-label': 'done' }, '✓') : null,
            el('button', {
              type: 'button',
              class: 'stages-participant__remove',
              'aria-label': `Remove ${p.name}`,
              title: 'Remove from session',
              onClick: () => {
                if (window.confirm(`Remove ${p.name} from the session?`)) void act('removeParticipant', { pid: p.id });
              },
            }, '×'),
          ),
        );
      }
      return list;
    }

    // ── Front page: the title screen, shown while people join ──
    function renderLobby(): HTMLElement {
      const s = view!.session;
      const hide = el('input', { type: 'checkbox', checked: s.hideExplicit }) as HTMLInputElement;
      hide.addEventListener('change', () => void act('setHideExplicit', { hideExplicit: hide.checked }));

      const running = el('ol', { class: 'stages-running-order' },
        el('li', {}, el('strong', {}, 'Put the stages in order'), ' — everyone builds their own timeline, then we compare.'),
        el('li', {}, el('strong', {}, 'Decide when things happen'), ' — activity cards go onto the timeline we agree.'),
        el('li', {}, el('strong', {}, 'Sharing fluids'), ' — the same timeline, plus a column for “never”.'),
      );

      return el('div', { class: 'stages-stack' },
        el('section', { class: 'stages-cover' },
          el('p', { class: 'stages-cover__eyebrow' }, 'An activity about relationships'),
          el('h2', { class: 'stages-cover__title' }, 'Stages in Relationships'),
          el('p', { class: 'stages-cover__lede' },
            'What happens when in a relationship — and who gets to decide. Three rounds of cards, and a lot of disagreement.'),
          codePanel(),
        ),
        el('div', { class: 'stages-lobby' },
          el('div', { class: 'stages-panel' },
            el('h2', { class: 'stages-panel__title' }, 'Who’s here'),
            participantsList(),
          ),
          el('div', { class: 'stages-panel' },
            el('h2', { class: 'stages-panel__title' }, 'How it runs'),
            running,
          ),
        ),
        el('div', { class: 'stages-panel' },
          el('h2', { class: 'stages-panel__title' }, 'When everyone’s in'),
          el('p', { class: 'stages-panel__text' },
            'Stage 1 sends everyone the relationship-stage cards to put in order on their own device. When they’ve all sent theirs, you reveal the lot together.'),
          el('div', { class: 'stages-actions' },
            btn('Start Stage 1', 'primary', () => void act('openStage1'), { disabled: view!.participants.length === 0 }),
          ),
          el('label', { class: 'form-check' }, hide, ' Hide the explicit cards (younger or SEND groups)'),
        ),
      );
    }

    // ── Section break between stages ──
    function renderRecap(id: RecapId): HTMLElement {
      const s = view!.session;
      const recap = getRecap(id, s.hideExplicit);
      const next: Record<RecapId, { label: string; step: Step }> = {
        recap1: { label: 'Continue to Stage 2: activities', step: 'stage2' },
        recap2: { label: 'Continue to Stage 3: sharing fluids', step: 'stage3' },
        recap3: { label: 'Finish and show the roundup', step: 'end' },
      };
      const forward = next[id];
      const blocked = (forward.step === 'stage2' || forward.step === 'stage3') && s.timeline.length < 2;
      return el('div', { class: 'stages-stack' },
        recapSlide(recap),
        el('div', { class: 'stages-actions' },
          btn(forward.label, 'primary', () => {
            if (forward.step === 'end') void act('end');
            else void act('setStep', { step: forward.step });
          }, { disabled: blocked, title: blocked ? 'Agree a timeline in Stage 1 first' : undefined }),
          btn(`Back to ${stageName(recap.stage)}`, 'tint', () => void act('setStep', { step: recap.stage })),
        ),
      );
    }

    function stageName(step: 'stage1' | 'stage2' | 'stage3'): string {
      if (step === 'stage1') return 'Stage 1';
      return step === 'stage2' ? 'Stage 2' : 'Stage 3';
    }

    // ── Stage 1 live ──
    function renderStage1Live(): HTMLElement {
      const submitted = view!.participants.filter((p) => p.stage1Submitted).length;
      const total = view!.participants.length;
      const cards = deckCards('stages', view!.session.hideExplicit);
      return el('div', { class: 'stages-stack' },
        el('div', { class: 'stages-lobby' },
          el('div', { class: 'stages-panel' },
            el('h2', { class: 'stages-panel__title' }, 'Stage 1: everyone is ordering the cards'),
            el('p', { class: 'stages-panel__text' }, `${submitted} of ${total} have sent their timeline.`),
            participantsList((p) => p.stage1Submitted),
            el('div', { class: 'stages-actions' },
              btn('Reveal everyone’s timelines', 'primary', () => void act('revealStage1'), { disabled: submitted === 0 }),
              btn('Restart Stage 1', 'text', () => {
                if (window.confirm('Clear everyone’s timelines and start Stage 1 again?')) void act('openStage1');
              }),
            ),
          ),
          codePanel(true),
        ),
        el('div', { class: 'stages-panel' },
          el('h3', { class: 'stages-panel__title' }, 'The cards they’re sorting'),
          el('div', { class: 'stages-reveal__cards' }, ...cards.map((c) => el('span', { class: 'stages-mini' }, c.label))),
        ),
      );
    }

    // ── Stage 1 reveal + timeline editor ──
    function renderStage1Reveal(): HTMLElement {
      const v = view!;
      const s = v.session;
      const visible = deckCards('stages', s.hideExplicit).map((c) => c.id);
      const wrap = el('div', { class: 'stages-stack' });

      // Everyone's rows
      const rows = el('div', { class: 'stages-reveal' });
      for (const sub of v.stage1.submissions) {
        rows.append(
          el('div', { class: 'stages-reveal__row' },
            el('span', { class: 'stages-reveal__name' }, sub.name),
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
      const cons = v.stage1.consensus;
      if (cons.submittedCount > 0) {
        rows.append(
          el('div', { class: 'stages-reveal__row stages-reveal__row--consensus' },
            el('span', { class: 'stages-reveal__name' }, 'Average'),
            el('div', { class: 'stages-reveal__cards' },
              ...cons.order.flatMap((id, i) => [
                i > 0 ? el('span', { class: 'stages-reveal__arrow', 'aria-hidden': 'true' }, '→') : null,
                el('span', { class: 'stages-mini' }, cardLabel(id)),
              ]),
              ...cons.out.map((id) => el('span', { class: 'stages-mini stages-mini--out' }, cardLabel(id))),
            ),
          ),
        );
      }
      wrap.append(
        el('div', { class: 'stages-panel' },
          el('h2', { class: 'stages-panel__title' }, `Stage 1: ${v.stage1.submissions.length} timeline${v.stage1.submissions.length === 1 ? '' : 's'}`),
          el('p', { class: 'stages-panel__text' }, 'Each row is one person’s order. Dashed cards are ones they left off the timeline.'),
          rows,
        ),
      );

      // Heat strip: where did each card land?
      if (v.stage1.submissions.length > 1) {
        const maxLen = Math.max(...v.stage1.submissions.map((x) => x.order.length));
        const heat = el('div', { class: 'stages-heat', role: 'table', 'aria-label': 'Where each card was placed' });
        for (const id of visible) {
          const counts = new Array<number>(maxLen).fill(0);
          let outN = 0;
          for (const sub of v.stage1.submissions) {
            const i = sub.order.indexOf(id);
            if (i >= 0) counts[i] += 1;
            else if (sub.out.includes(id)) outN += 1;
          }
          const cells = el('div', { class: 'stages-heat__cells' });
          counts.forEach((n, i) => {
            cells.append(el('span', { class: 'stages-heat__cell', dataset: { n: String(Math.min(n, 4)) }, title: `Position ${i + 1}: ${n}` }, n ? String(n) : ''));
          });
          cells.append(el('span', { class: 'stages-heat__cell stages-heat__cell--out', dataset: { n: String(Math.min(outN, 4)) }, title: `Left off: ${outN}` }, outN ? `×${outN}` : ''));
          heat.append(el('div', { class: 'stages-heat__row', role: 'row' }, el('span', { class: 'stages-heat__label' }, cardLabel(id)), cells));
        }
        wrap.append(
          el('div', { class: 'stages-panel' },
            el('h3', { class: 'stages-panel__title' }, 'How spread out were people?'),
            el('p', { class: 'stages-panel__text' }, 'Columns are positions 1 to last; the final column is “left off”. Darker means more people put the card there.'),
            heat,
          ),
        );
      }

      // Timeline editor
      if (!editTimeline) {
        if (s.timeline.length >= 2) {
          editTimeline = { order: s.timeline.slice(), out: visible.filter((id) => !s.timeline.includes(id)) };
        } else if (cons.submittedCount > 0) {
          editTimeline = { order: cons.order.slice(), out: [...cons.out, ...visible.filter((id) => !cons.order.includes(id) && !cons.out.includes(id))] };
        } else {
          editTimeline = { order: visible.slice(), out: [] };
        }
      }
      const timeline = el('div', { class: 'stages-sort stages-sort--row', 'aria-label': 'Agreed timeline' });
      for (const id of editTimeline.order) timeline.append(cardEl(getCard(id)!));
      const outPile = el('div', { class: 'stages-sort stages-sort--row stages-sort--out', 'aria-label': 'Left off the timeline' });
      for (const id of editTimeline.out) outPile.append(cardEl(getCard(id)!));
      const sync = () => {
        editTimeline = {
          order: Array.from(timeline.querySelectorAll<HTMLElement>('[data-card-id]')).map((n) => n.dataset.cardId!),
          out: Array.from(outPile.querySelectorAll<HTMLElement>('[data-card-id]')).map((n) => n.dataset.cardId!),
        };
      };
      for (const list of [timeline, outPile]) {
        sortables.push(new Sortable(list, {
          group: 'host-timeline',
          animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150,
          forceFallback: true,
          fallbackOnBody: true,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          delay: 120,
          delayOnTouchOnly: true,
          onSort: sync,
          onAdd: sync,
          onRemove: sync,
        }));
      }
      wrap.append(
        el('div', { class: 'stages-panel' },
          el('h2', { class: 'stages-panel__title' }, 'Agree the group’s timeline'),
          el('p', { class: 'stages-panel__text' }, 'Starts from the average order. Drag to change it as the group discusses. These become the columns for Stages 2 and 3.'),
          el('div', { class: 'stages-sort-group' },
            el('div', {}, el('h3', { class: 'stages-sort-group__label' }, 'Timeline'), timeline),
            el('div', {}, el('h3', { class: 'stages-sort-group__label' }, 'Left off'), outPile),
          ),
          el('div', { class: 'stages-actions' },
            btn('Save the timeline and continue', 'primary', async () => {
              sync();
              if (editTimeline!.order.length < 2) {
                errorText = 'The timeline needs at least two cards.';
                renderStatus();
                return;
              }
              const ok = await act('setTimeline', { timeline: editTimeline!.order });
              if (ok) await act('setStep', { step: 'recap1' });
            }),
            btn('Restart Stage 1', 'text', () => {
              if (window.confirm('Clear everyone’s timelines and start Stage 1 again?')) {
                editTimeline = null;
                void act('openStage1');
              }
            }),
          ),
        ),
      );
      return wrap;
    }

    // ── Stage 2 / 3 ──
    function renderPlacement(stage: PlacementStage): HTMLElement {
      const v = view!;
      const s = v.session;
      const round = s[stage];
      const tally = v[stage];
      const deckId = stage === 'stage2' ? 'activities' : 'fluids';
      const columns = timelineColumns(s.timeline, stage === 'stage3');
      const wrap = el('div', { class: 'stages-stack' });

      wrap.append(
        el('div', { class: 'stages-section__text' },
          el('h2', { class: 'stages-section__title' },
            stage === 'stage2' ? 'Stage 2: when does each of these happen?' : 'Stage 3: sharing fluids'),
          el('p', { class: 'stages-section__intro' },
            stage === 'stage2'
              ? 'Send a few cards at a time. Everyone places them on their own device, then you reveal where they landed.'
              : 'Same columns, plus “Never”. Watch where the gum ends up compared with kissing.'),
        ),
      );

      // Board
      const board = el('div', { class: 'stages-board' });
      const bodies = renderColumns(board, columns, { fill: true });
      const unplaced: string[] = [];
      for (const id of round.done) {
        const t = tally[id];
        const card = getCard(id);
        if (!card) continue;
        const m = t ? majority(t.counts) : { columns: [], max: 0, total: 0 };
        const body = m.columns[0] ? bodies.get(m.columns[0]) : undefined;
        if (!body) {
          unplaced.push(id);
          continue;
        }
        body.append(cardEl(card, {
          static: true,
          count: m.max,
          extraClass: `stages-card--done${m.columns.length > 1 ? ' stages-card--split' : ''}`,
          onRemove: () => void act('undoDone', { stage, cardId: id }),
          removeTitle: `Take “${card.label}” off the board`,
        }));
      }
      // Stage 3 keeps the activities on the board so the fluids cards can
      // be read against them ("you'd kiss here but not meet the parents
      // until here").
      if (stage === 'stage3') {
        for (const [id, col] of Object.entries(v.board.stage2)) {
          const body = bodies.get(col);
          const card = getCard(id);
          if (body && card) body.append(cardEl(card, { static: true, extraClass: 'stages-card--done stages-card--context' }));
        }
      }
      if (round.revealed) {
        for (const id of round.open) {
          const t = tally[id];
          const card = getCard(id);
          if (!card || !t) continue;
          const m = majority(t.counts);
          for (const [col, n] of Object.entries(t.counts)) {
            const body = bodies.get(col);
            if (!body || !n) continue;
            const isMaj = m.columns.includes(col);
            body.append(cardEl(card, {
              static: true,
              count: n,
              extraClass: `${isMaj ? 'stages-card--majority' : 'stages-card--minority'}${isMaj && m.columns.length > 1 ? ' stages-card--split' : ''}`,
            }));
          }
        }
      }
      updateColumnCounts(board);
      wrap.append(board);
      wrap.append(el('p', { class: 'stages-key' },
        el('span', { class: 'stages-key__item' }, el('span', { class: 'stages-key__swatch', 'aria-hidden': 'true' }), 'Activities'),
        stage === 'stage3' ? el('span', { class: 'stages-key__item' }, el('span', { class: 'stages-key__swatch stages-key__swatch--fluids', 'aria-hidden': 'true' }), 'Sharing fluids') : null,
        el('span', { class: 'stages-key__item' }, 'Solid = where most people put it · pale = other answers · dashed = a tie'),
      ));
      if (unplaced.length) {
        wrap.append(el('p', { class: 'stages-note' }, `Nobody placed: ${unplaced.map(cardLabel).join(', ')}.`));
      }

      // Round panel
      const total = v.participants.length;
      if (round.open.length) {
        const doneAll = v.participants.filter((p) => (stage === 'stage2' ? p.stage2Placed : p.stage3Placed) >= round.open.length).length;
        const panel = el('div', { class: 'stages-panel' });
        panel.append(
          el('h3', { class: 'stages-panel__title' }, round.revealed ? 'Revealed' : 'Cards in play'),
          el('p', { class: 'stages-panel__text' },
            round.revealed
              ? 'Solid cards show where most people put each one; lighter cards are the other answers. Talk it through, then keep them on the board.'
              : `${doneAll} of ${total} have placed every card.`),
        );
        const list = el('div', { class: 'stages-reveal__cards' });
        for (const id of round.open) {
          const n = tally[id] ? majority(tally[id].counts).total : 0;
          list.append(el('span', { class: 'stages-mini' }, `${cardLabel(id)} · ${n}/${total}`));
        }
        panel.append(list);
        if (round.revealed) {
          const who = el('div', { class: 'stages-stack' });
          for (const id of round.open) {
            const t = tally[id];
            if (!t?.names) continue;
            const lines = columns
              .filter((c) => t.names![c.id]?.length)
              .map((c) => el('p', { class: 'stages-note' }, el('strong', {}, `${c.label}: `), t.names![c.id].join(', ')));
            if (lines.length) who.append(el('div', {}, el('p', { class: 'stages-summary__card' }, cardLabel(id)), ...lines));
          }
          panel.append(el('details', {}, el('summary', { class: 'stages-note' }, 'Who put what where'), who));
          panel.append(el('div', { class: 'stages-actions' },
            btn('Keep these on the board and pick the next cards', 'primary', () => void act('closeRound', { stage })),
          ));
        } else {
          panel.append(el('div', { class: 'stages-actions' },
            btn('Reveal', 'primary', () => void act('reveal', { stage }), { disabled: total === 0 }),
            participantsList((p) => (stage === 'stage2' ? p.stage2Placed : p.stage3Placed) >= round.open.length),
          ));
          panel.append(el('p', { class: 'stages-note' }, 'Changed your mind? Choosing different cards below replaces these and clears any answers so far.'));
          showPicker = showPicker || false;
        }
        wrap.append(panel);
      }

      // Picker
      if (!round.open.length || !round.revealed) {
        const used = new Set([...round.done, ...round.open]);
        const remaining = deckCards(deckId, s.hideExplicit).filter((c) => !used.has(c.id));
        const sel = picked[stage];
        for (const id of Array.from(sel)) if (!remaining.some((c) => c.id === id)) sel.delete(id);

        const listEl = el('div', { class: 'stages-picker__list', role: 'group', 'aria-label': 'Cards to send' });
        const chips: HTMLButtonElement[] = [];
        const refreshChips = () => {
          for (const chip of chips) {
            const on = sel.has(chip.dataset.cardId!);
            chip.classList.toggle('is-active', on);
            chip.setAttribute('aria-pressed', on ? 'true' : 'false');
          }
          sendBtn.textContent = sel.size ? `Send ${sel.size} selected` : 'Send selected';
          sendBtn.disabled = sel.size === 0 || sel.size > 20;
          sendBtn.classList.toggle('btn--disabled', sendBtn.disabled);
        };
        for (const c of remaining) {
          const chip = el('button', {
            type: 'button',
            class: 'chip',
            dataset: { cardId: c.id },
            'aria-pressed': 'false',
            onClick: () => {
              if (sel.has(c.id)) sel.delete(c.id);
              else sel.add(c.id);
              refreshChips();
            },
          }, c.label, c.added ? el('span', { class: 'chip__count' }, 'new') : null) as HTMLButtonElement;
          chips.push(chip);
          listEl.append(chip);
        }
        const send = async (ids: string[]) => {
          if (!ids.length) return;
          const ok = await act('openCards', { stage, cardIds: ids });
          if (ok) sel.clear();
        };
        const sendBtn = btn('Send selected', 'primary', () => void send(Array.from(sel)));
        const header = el('div', { class: 'stages-picker__header' },
          el('h3', { class: 'stages-panel__title' }, round.open.length ? 'Choose different cards' : 'Choose the next cards'),
          el('span', { class: 'stages-deck__count' }, `${remaining.length} left`),
        );
        const actions = el('div', { class: 'stages-actions' },
          sendBtn,
          btn('Send 1 at random', 'tint', () => void send(shuffle(remaining.map((c) => c.id)).slice(0, 1)), { disabled: !remaining.length }),
          btn('Send 3 at random', 'tint', () => void send(shuffle(remaining.map((c) => c.id)).slice(0, 3)), { disabled: remaining.length < 1 }),
          btn('Clear selection', 'text', () => {
            sel.clear();
            refreshChips();
          }),
        );
        refreshChips();
        wrap.append(el('div', { class: 'stages-panel stages-picker' }, header, actions, listEl));
      }

      // Navigation between stages
      const nav = el('div', { class: 'stages-actions' });
      if (stage === 'stage2') {
        nav.append(
          btn('Show the key points from Stage 2', 'primary', () => void act('setStep', { step: 'recap2' })),
          btn('Skip to Stage 3', 'tint', () => void act('setStep', { step: 'stage3' })),
        );
      } else {
        nav.append(
          btn('Show the key points from Stage 3', 'primary', () => void act('setStep', { step: 'recap3' })),
          btn('Back to Stage 2', 'tint', () => void act('setStep', { step: 'stage2' })),
        );
      }
      nav.append(
        btn('Edit the timeline', 'text', () => {
          editTimeline = null;
          void act('setStep', { step: 'stage1' });
        }),
        btn(`Clear Stage ${stage === 'stage2' ? '2' : '3'}`, 'danger-text', () => {
          if (window.confirm('Clear this stage’s board and everyone’s answers for it?')) void act('resetStage', { stage });
        }),
      );
      wrap.append(nav);
      return wrap;
    }

    // ── End ──
    function renderEnd(): HTMLElement {
      const v = view!;
      const s = v.session;
      const rows = el('div', { class: 'stages-reveal' });
      for (const sub of v.stage1.submissions) {
        rows.append(
          el('div', { class: 'stages-reveal__row' },
            el('span', { class: 'stages-reveal__name' }, sub.name),
            el('div', { class: 'stages-reveal__cards' },
              ...sub.order.flatMap((id, i) => [
                i > 0 ? el('span', { class: 'stages-reveal__arrow', 'aria-hidden': 'true' }, '→') : null,
                miniEl(id),
              ]),
              ...sub.out.map((id) => miniEl(id, 'stages-mini--out')),
            ),
          ),
        );
      }
      if (s.timeline.length) {
        rows.append(
          el('div', { class: 'stages-reveal__row stages-reveal__row--consensus' },
            el('span', { class: 'stages-reveal__name' }, 'Agreed'),
            el('div', { class: 'stages-reveal__cards' },
              ...s.timeline.flatMap((id, i) => [
                i > 0 ? el('span', { class: 'stages-reveal__arrow', 'aria-hidden': 'true' }, '→') : null,
                miniEl(id),
              ]),
            ),
          ),
        );
      }
      return el('div', { class: 'stages-stack' },
        el('section', { class: 'stages-cover stages-cover--end' },
          el('p', { class: 'stages-cover__eyebrow' }, 'That’s the activity'),
          el('h2', { class: 'stages-cover__title' }, 'Three things worth taking away'),
          closingMessagesEl(),
        ),
        el('div', { class: 'stages-section__text' },
          el('h2', { class: 'stages-section__title' }, 'Roundup'),
          el('p', { class: 'stages-section__intro' }, 'Where the group agreed, and where it didn’t. Participants see the same on their phones, along with their own original timeline.'),
        ),
        roundupEl(v.summary),
        rows.childElementCount ? el('div', { class: 'stages-panel' }, el('h3', { class: 'stages-panel__title' }, 'Everyone’s original timelines'), rows) : null,
        el('div', { class: 'stages-panel' },
          el('h2', { class: 'stages-panel__title' }, 'Session finished'),
          el('p', { class: 'stages-panel__text' }, 'You can still look back at the boards, or delete the session.'),
          el('div', { class: 'stages-actions' },
            btn('Look at the Stage 3 board', 'tint', () => void act('setStep', { step: 'stage3' })),
            btn('Look at the Stage 2 board', 'tint', () => void act('setStep', { step: 'stage2' })),
            btn('Delete this session', 'danger-text', () => {
              if (window.confirm(`Delete session ${s.code} and everyone’s answers? This can’t be undone.`)) void act('delete');
            }),
          ),
        ),
      );
    }
  }
}

void NEVER_COLUMN_ID;
void columnLabel;
