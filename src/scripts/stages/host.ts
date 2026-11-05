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
  getSlide,
  isSlideId,
  nextBeatLabel,
  placementBoard,
  qrCode,
  slideBeats,
  stepLabel,
  slideEl,
  screenUrl,
  removeLocal,
  roundupEl,
  type SlideId,
  type Summary,
  saveLocal,
  shuffle,
  timelineColumns,
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
  screenToken: string;
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
  // A controls link from another device (#h=<host token>) makes this
  // browser a second desk for the session. The token sits in the
  // fragment so it never reaches the server's logs, and it comes off
  // the address straight away so it isn't left in history or shared.
  const handed = new URLSearchParams(location.hash.slice(1)).get('h') ?? '';
  if (urlCode && /^[A-Za-z0-9]{32}$/.test(handed)) {
    saveLocal(STORE_KEY, { code: urlCode, hostToken: handed } satisfies StoredHost);
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
  const stored = loadLocal<StoredHost>(STORE_KEY);

  // ── Which session? ──
  // Arriving without a code means starting out, so offer a new session
  // first. The one this browser remembers may be from an earlier
  // workshop and part-way through, which would skip the welcome screen;
  // it's offered underneath instead of being reopened automatically.
  // A reload mid-session keeps ?code= in the address, so it resumes.
  if (!urlCode) {
    renderCreate();
    if (stored) void offerStored(stored);
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

  /** Under the create form: the session this browser last ran, if it
   *  still exists, with a link back into it. */
  async function offerStored(other: StoredHost) {
    let view: HostView;
    try {
      view = await apiGet<HostView>('session', { code: other.code, host: other.hostToken });
    } catch (err) {
      // Expired (sessions last 24 hours) or no longer ours: forget it.
      if (err instanceof ApiError && (err.status === 404 || err.status === 403)) removeLocal(STORE_KEY);
      return;
    }
    const s = view.session;
    const where = s.step === 'end' ? 'It has finished' : s.step === 'lobby' ? 'It’s on the welcome screen' : `It’s on ${stepLabel(s.step)}`;
    const joined = `${view.participants.length} ${view.participants.length === 1 ? 'person' : 'people'} joined`;
    main.append(
      el('div', { class: 'stages-panel stages-join-form' },
        el('h2', { class: 'stages-panel__title' }, `Your last session, ${other.code}, is still open`),
        el('p', { class: 'stages-panel__text' },
          `${where}, with ${joined}. Starting a new session above gives you a new code and a fresh welcome screen; the old one is deleted after 24 hours.`),
        el('div', { class: 'stages-actions' },
          el('a', { class: 'btn btn--std btn--tint', href: `${BASE_PATH}/host/?code=${other.code}` }, `Carry on with ${other.code}`),
        ),
      ),
    );
  }

  function renderNotHost(code: string, other: StoredHost | null) {
    clear(main);
    main.append(
      el('div', { class: 'stages-panel stages-join-form' },
        el('h2', { class: 'stages-panel__title' }, 'This browser isn’t running that session'),
        el('p', { class: 'stages-panel__text' },
          `Session ${code} was started in a different browser. To run it from here, open the controls link from that browser: “Controls on another device” on its desk, as a QR code or a link to copy.`),
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
    // Whether the QR code for opening the controls on another device is up.
    let handover = false;
    // Timeline edits go to the presenter screen as they happen, a beat
    // after each drag. Saving waits for the last one to land, so a late
    // draft can't overwrite the save.
    let draftTimer: number | undefined;
    let draftSending: Promise<unknown> = Promise.resolve();
    const sendDraft = () => {
      if (!editTimeline) return;
      const { order, out } = editTimeline;
      draftSending = draftSending.then(() =>
        apiPost('host', { code: auth.code, hostToken: auth.hostToken, action: 'setDraftTimeline', order, out })
          .catch(() => { /* the presenter misses one step; the next drag or the save catches it up */ }));
    };
    const queueDraft = () => {
      window.clearTimeout(draftTimer);
      draftTimer = window.setTimeout(sendDraft, 300);
    };
    const flushDraft = async () => {
      if (draftTimer !== undefined) {
        window.clearTimeout(draftTimer);
        draftTimer = undefined;
      }
      await draftSending;
    };
    // Whether the facilitator has chosen to take back the cards that are
    // out. Until then the picker only lines up the next cards: sending new
    // cards replaces the open ones and clears everyone's answers to them.
    const replacing: Record<PlacementStage, boolean> = { stage2: false, stage3: false };
    // What's typed in each picker's search box.
    const search: Record<PlacementStage, string> = { stage2: '', stage3: '' };
    let sortables: Sortable[] = [];
    // A redraw mid-drag would drop the card being dragged; wait for the drop.
    let dragging = false;
    let redrawAfterDrag = false;
    // A drop can also fire a click on the card; that click isn't a pick.
    let droppedAt = 0;

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
            if (err.status === 403) {
              renderGone('This browser doesn’t have the controls for that session. Open the controls link again from the desk that started it.', 'Can’t open these controls');
            } else renderGone(err.message);
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

    function renderGone(message: string, title = 'Session ended') {
      clear(toolbar);
      clear(main);
      main.append(
        el('div', { class: 'stages-panel stages-join-form' },
          el('h2', { class: 'stages-panel__title' }, title),
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

    /** Re-render after a change to local UI state, which the polling
     *  change-detection key doesn't see. */
    function rerender() {
      lastKey = '';
      render();
    }

    // ── Render root ──
    function render() {
      if (!view) return;
      // Skip the expensive re-render when nothing changed (polling).
      // Online/offline flips only matter visually in the lobby; elsewhere
      // they go through renderStatus() so buttons don't re-render under
      // the facilitator's cursor.
      // The timeline draft is this desk's own edit echoed back, so it (and
      // the version bump it causes) mustn't redraw the editor mid-drag.
      const { version: _version, updatedAt: _updatedAt, ...session } = view.session;
      const keyed = { ...view, session: { ...session, stage1: { ...session.stage1, draft: undefined } } };
      const key = JSON.stringify(
        view.session.step === 'lobby'
          ? keyed
          : { ...keyed, participants: view.participants.map(({ online: _online, ...p }) => p) },
      );
      if (key === lastKey) {
        renderStatus();
        return;
      }
      if (dragging) {
        redrawAfterDrag = true;
        return;
      }
      lastKey = key;
      sortables.forEach((s) => s.destroy());
      sortables = [];
      // Polling re-renders while the facilitator may be typing (the search
      // box): put the cursor back where it was.
      const focused = document.activeElement instanceof HTMLInputElement ? document.activeElement : null;
      const keepFocus = focused?.dataset.keepFocus;
      const caret = focused?.selectionStart ?? null;

      renderToolbar();
      clear(main);
      if (handover) main.append(handoverPanel());
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
        case 'intro1':
        case 'intro2':
        case 'intro3':
        case 'recap1':
        case 'recap2':
        case 'recap3':
          main.append(renderSlide(s.step));
          break;
        case 'end':
          main.append(renderEnd());
          break;
      }
      main.append(errorLine);
      renderStatus();
      if (keepFocus) {
        const input = main.querySelector<HTMLInputElement>(`[data-keep-focus="${keepFocus}"]`);
        if (input) {
          input.focus({ preventScroll: true });
          if (caret !== null) input.setSelectionRange(caret, caret);
        }
      }
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
      // An intro or a section break lights up the stage it belongs to.
      const onStep = isSlideId(s.step) ? getSlide(s.step).stage : s.step;
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
                // A stage nobody has started yet opens on its intro.
                if (st.id === 'stage1' && !s.stage1.open && !s.stage1.revealed) void act('setStep', { step: 'intro1' });
                else if ((st.id === 'stage2' || st.id === 'stage3') && !s[st.id].open.length && !s[st.id].done.length) {
                  void act('setStep', { step: st.id === 'stage2' ? 'intro2' : 'intro3' });
                } else void act('setStep', { step: st.id });
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
      toolbar.append(stepper, code, presenterControls(), deskControls(), el('div', { class: 'stages-toolbar__spacer' }), status);
    }

    // ── Controls on a second device, e.g. an iPad while a laptop presents ──
    function deskUrl(): string {
      return `${location.origin}${BASE_PATH}/host/?code=${auth.code}#h=${auth.hostToken}`;
    }

    function deskControls(): HTMLElement {
      return el('div', { class: 'stages-toolbar__group' },
        el('span', { class: 'stages-note' }, 'Controls on another device '),
        btn(handover ? 'Hide QR code' : 'Show QR code', 'tint', () => {
          handover = !handover;
          rerender();
        }, { small: true }),
        btn('Copy link', 'text', async () => {
          const ok = await copyText(deskUrl());
          status.textContent = ok ? 'Controls link copied. Anyone with it can run the session, so send it only to yourself.' : 'Copy failed.';
        }, { small: true }),
      );
    }

    /** Shown at the top of the desk while the QR code is open. */
    function handoverPanel(): HTMLElement {
      return el('div', { class: 'stages-panel stages-handover' },
        el('div', { class: 'stages-handover__text' },
          el('h2', { class: 'stages-panel__title' }, 'Open these controls on another device'),
          el('p', { class: 'stages-panel__text' },
            'Scan this with the camera on your iPad or phone. That device gets the same controls as this one, and both keep working, so you can run the session there and present from here.'),
          el('p', { class: 'stages-note' },
            el('strong', {}, 'Don’t show this on a shared screen. '), 'Anyone who scans it can run the session.'),
          el('div', { class: 'stages-actions' },
            btn('Hide QR code', 'tint', () => {
              handover = false;
              rerender();
            }, { small: true }),
          ),
        ),
        qrCode(deskUrl(), 'QR code: scan to open the facilitator controls on another device'),
      );
    }

    // ── Presenter screen: the clean view the group watches ──
    function presenterControls(): HTMLElement {
      const s = view!.session;
      const url = screenUrl(s.code, view!.screenToken);
      const names = el('input', { type: 'checkbox', checked: s.showNames === true }) as HTMLInputElement;
      names.addEventListener('change', () => void act('setShowNames', { showNames: names.checked }));
      return el('div', { class: 'stages-toolbar__group' },
        el('span', { class: 'stages-note' }, 'Presenter screen '),
        btn('Open', 'tint', () => {
          // A window of its own, so a video call can share just that.
          window.open(url, `stages-screen-${s.code}`, 'popup,width=1280,height=800');
        }, { small: true }),
        btn('Copy link', 'text', async () => {
          const ok = await copyText(url);
          status.textContent = ok ? 'Presenter link copied. Anyone with it can see the screen, so keep it to facilitators.' : 'Copy failed.';
        }, { small: true }),
        el('label', { class: 'form-check stages-note' }, names, ' Show names'),
      );
    }

    // ── Shared bits ──
    function codePanel(compact = false): HTMLElement {
      const s = view!.session;
      const url = joinUrl(s.code);
      return el('div', { class: 'stages-code-panel' },
        el('p', { class: 'stages-code-panel__label' }, compact ? 'Join code' : 'Join with this code'),
        el('p', { class: 'stages-code' }, s.code),
        el('p', { class: 'stages-code-panel__url' }, url.replace(/^https?:\/\//, '')),
        compact ? null : qrCode(url, 'QR code: scan to join'),
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
        el('li', {}, el('strong', {}, 'Put the stages in order.'), ' Everyone builds their own timeline, then we compare.'),
        el('li', {}, el('strong', {}, 'Decide when things happen.'), ' Activity cards go onto the timeline we agree, or into “Never”.'),
        el('li', {}, el('strong', {}, 'Sharing fluids.'), ' The same columns again.'),
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
            'Next comes a slide explaining Stage 1, which you build up one point at a time. Then Stage 1 sends everyone the relationship-stage cards to put in order on their own device. When they’ve all sent theirs, you reveal the lot together.'),
          el('div', { class: 'stages-actions' },
            btn('Introduce Stage 1', 'primary', () => void act('setStep', { step: 'intro1' })),
          ),
          el('label', { class: 'form-check' }, hide, ' Hide the explicit cards (younger or SEND groups)'),
        ),
      );
    }

    // ── Slides: what to expect before a stage, key points after it ──
    // Each click shows the next point on every screen. The desk shows the
    // whole slide, with what's still to come faded, so the facilitator
    // can see what she's about to put up.
    function renderSlide(id: SlideId): HTMLElement {
      const s = view!.session;
      const slide = getSlide(id, s.hideExplicit);
      const total = slideBeats(slide);
      const shown = Math.min(s.slide ?? 0, total);
      const nextPoint = nextBeatLabel(slide, shown);
      const forward = slideForward(id);
      const needsTimeline = (forward.step === 'stage2' || forward.step === 'stage3' || forward.step === 'intro2' || forward.step === 'intro3')
        && s.timeline.length < 2;
      const nobodyIn = forward.step === 'stage1' && view!.participants.length === 0;
      const blocked = needsTimeline || nobodyIn;
      const back = slideBack(id);

      const actions = el('div', { class: 'stages-actions' });
      if (nextPoint) {
        actions.append(btn('Show the next point', 'primary', () => void act('setSlide', { slide: shown + 1 })));
        actions.append(btn('Show the rest', 'tint', () => void act('setSlide', { slide: total })));
      } else {
        actions.append(btn(forward.label, 'primary', () => void goForward(forward.step), {
          disabled: blocked,
          title: needsTimeline ? 'Agree a timeline in Stage 1 first' : nobodyIn ? 'Wait for someone to join' : undefined,
        }));
      }
      if (shown > 0) actions.append(btn('Hide the last point', 'tint', () => void act('setSlide', { slide: shown - 1 })));
      actions.append(btn(back.label, 'text', () => void act('setStep', back.slide ? { step: back.step, slide: 999 } : { step: back.step })));

      const upNext = nextPoint
        ? el('p', { class: 'stages-note stages-slide-next', 'aria-live': 'polite' },
            el('strong', {}, 'Next click shows: '), nextPoint,
            el('span', {}, ` (${shown} of ${total} showing). The right arrow, space bar or a presentation clicker also moves on.`))
        : el('p', { class: 'stages-note stages-slide-next', 'aria-live': 'polite' },
            el('strong', {}, 'Everything on this slide is showing. '), forward.note);

      return el('div', { class: 'stages-stack' },
        slideEl(slide, { shown, preview: true }),
        el('div', { class: 'stages-slide-desk' }, upNext, actions),
      );
    }

    /** Where the button at the end of a slide goes. */
    function slideForward(id: SlideId): { label: string; step: Step; note: string } {
      switch (id) {
        case 'intro1': return { label: 'Start Stage 1', step: 'stage1', note: 'Next, everyone gets the stage cards on their own device.' };
        case 'recap1': return { label: 'Introduce Stage 2', step: 'intro2', note: 'Next is the slide explaining Stage 2.' };
        case 'intro2': return { label: 'Start Stage 2', step: 'stage2', note: 'Next you choose the first activity cards to send.' };
        case 'recap2': return { label: 'Introduce Stage 3', step: 'intro3', note: 'Next is the slide explaining Stage 3.' };
        case 'intro3': return { label: 'Start Stage 3', step: 'stage3', note: 'Next you choose the first sharing-fluids cards to send.' };
        case 'recap3': return { label: 'Finish and show the roundup', step: 'end', note: 'Next is the roundup, which closes the session for participants.' };
      }
    }

    /** The step before a slide. Going back to a slide shows it complete. */
    function slideBack(id: SlideId): { label: string; step: Step; slide: boolean } {
      switch (id) {
        case 'intro1': return { label: 'Back to the welcome screen', step: 'lobby', slide: false };
        case 'recap1': return { label: 'Back to Stage 1', step: 'stage1', slide: false };
        case 'intro2': return { label: 'Back to the Stage 1 key points', step: 'recap1', slide: true };
        case 'recap2': return { label: 'Back to Stage 2', step: 'stage2', slide: false };
        case 'intro3': return { label: 'Back to the Stage 2 key points', step: 'recap2', slide: true };
        case 'recap3': return { label: 'Back to Stage 3', step: 'stage3', slide: false };
      }
    }

    async function goForward(step: Step) {
      const s = view!.session;
      if (step === 'end') await act('end');
      // Starting Stage 1 for the first time sends out the cards. If it's
      // already running, just go back to it rather than clearing answers.
      else if (step === 'stage1' && !s.stage1.open && !s.stage1.revealed) await act('openStage1');
      else await act('setStep', { step });
    }

    // A presentation clicker sends Page Down / Page Up (or the arrow
    // keys), so the desk moves through a slide's points the same way.
    // It never leaves the slide: starting a stage stays a button press.
    document.addEventListener('keydown', (e) => {
      if (!view || !isSlideId(view.session.step) || busy) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('input, textarea, select, [contenteditable]') || (e.key === ' ' && target.closest('button, a')))) return;
      const s = view.session;
      const total = slideBeats(getSlide(s.step as SlideId, s.hideExplicit));
      const shown = Math.min(s.slide ?? 0, total);
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        if (shown < total) void act('setSlide', { slide: shown + 1 });
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        if (shown > 0) void act('setSlide', { slide: shown - 1 });
      }
    });

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
              // Left-off cards are counted, not listed, to keep rows short.
              sub.out.length ? el('span', { class: 'stages-note' }, `${sub.out.length} left off`) : null,
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
      const averageShown = s.stage1.averageShown === true;
      wrap.append(
        el('div', { class: 'stages-panel' },
          el('h2', { class: 'stages-panel__title' }, `Stage 1: ${v.stage1.submissions.length} timeline${v.stage1.submissions.length === 1 ? '' : 's'}`),
          el('p', { class: 'stages-panel__text' }, 'Each row is one person’s order, with how many cards they left off. The average row shows the cards most people left off.'),
          rows,
          el('p', { class: 'stages-note' },
            averageShown
              ? s.stage1.draft
                ? 'The presenter screen is showing the group’s timeline, and follows your changes below.'
                : 'The presenter screen is showing the average.'
              : 'The presenter screen shows everyone’s timelines. Compare them first, then show the average.'),
          el('div', { class: 'stages-actions' },
            averageShown
              ? btn('Back to everyone’s timelines', 'tint', () => void act('showAverage', { shown: false }))
              : btn(s.stage1.draft ? 'Show the group’s timeline on the presenter screen' : 'Show the average on the presenter screen', 'tint', () => void act('showAverage', { shown: true }), { disabled: cons.submittedCount === 0 }),
          ),
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
        const draft = s.stage1.draft;
        if (draft && draft.order.length + draft.out.length > 0) {
          const known = new Set([...draft.order, ...draft.out]);
          editTimeline = { order: draft.order.filter((id) => visible.includes(id)), out: [...draft.out.filter((id) => visible.includes(id)), ...visible.filter((id) => !known.has(id))] };
        } else if (s.timeline.length >= 2) {
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
      const changed = () => {
        sync();
        queueDraft();
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
          onStart: () => {
            dragging = true;
          },
          onEnd: () => {
            dragging = false;
            if (redrawAfterDrag) {
              redrawAfterDrag = false;
              window.setTimeout(render, 0);
            }
          },
          onSort: changed,
          onAdd: changed,
          onRemove: changed,
        }));
      }
      wrap.append(
        el('div', { class: 'stages-panel' },
          el('h2', { class: 'stages-panel__title' }, 'Agree the group’s timeline'),
          el('p', { class: 'stages-panel__text' }, 'Starts from the average order. Drag to change it as the group discusses; the presenter screen follows along. These become the columns for Stages 2 and 3.'),
          el('div', { class: 'stages-sort-group' },
            el('div', {}, el('h3', { class: 'stages-sort-group__label' }, 'Timeline'), timeline),
            el('div', {}, el('h3', { class: 'stages-sort-group__label' }, 'Left off'), outPile),
          ),
          el('div', { class: 'stages-actions' },
            btn('Save the timeline and continue', 'primary', async () => {
              sync();
              await flushDraft();
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
                void flushDraft().then(() => act('openStage1'));
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
      if (!round.open.length || round.revealed) replacing[stage] = false;
      const tally = v[stage];
      const deckId = stage === 'stage2' ? 'activities' : 'fluids';
      const columns = timelineColumns(s.timeline);
      const wrap = el('div', { class: 'stages-stack' });

      wrap.append(
        el('div', { class: 'stages-section__text' },
          el('h2', { class: 'stages-section__title' },
            stage === 'stage2' ? 'Stage 2: when does each of these happen?' : 'Stage 3: sharing fluids'),
          el('p', { class: 'stages-section__intro' },
            stage === 'stage2'
              ? 'Send a few cards at a time. Everyone places them on their own device, then you reveal where they landed.'
              : 'Same columns as Stage 2. Watch where the gum ends up compared with kissing.'),
        ),
      );

      const placed = s.placed?.[stage] ?? {};
      const boardEls = placementBoard({
        stage,
        timeline: s.timeline,
        round,
        tally,
        stage2Board: v.board.stage2,
        placed,
        onRemove: (cardId) => void act('undoDone', { stage, cardId }),
        movable: true,
        // Click a kept card to put everyone's answers for it back on the
        // presenter screen while the group talks about it.
        spotlight: s.spotlight?.stage === stage ? s.spotlight.cardId : null,
        onPick: (cardId) => {
          if (Date.now() - droppedAt < 400) return;
          void act('spotlight', { stage, cardId: s.spotlight?.stage === stage && s.spotlight.cardId === cardId ? null : cardId });
        },
        pickHint: 'Click it again to hide.',
      });
      wrap.append(...boardEls);
      if (round.done.length && !(s.spotlight?.stage === stage)) {
        wrap.append(el('p', { class: 'stages-note' }, 'Click a kept card to show where everyone put it, here and on the presenter screen.'));
      }

      // Drag a solid card to another column to put it there: a kept card
      // at any time, a card in play once it is revealed.
      const place = async (cardId: string, columnId: string | null) => {
        if (!(await act('placeCard', { stage, cardId, columnId }))) rerender();
      };
      const boardEl = boardEls.find((n) => n.classList.contains('stages-board'))!;
      for (const body of boardEl.querySelectorAll<HTMLElement>('.stages-column__body')) {
        sortables.push(new Sortable(body, {
          group: `host-board-${stage}`,
          draggable: '.stages-card--movable',
          filter: '.stages-card__remove',
          preventOnFilter: false,
          sort: false,
          animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150,
          forceFallback: true,
          fallbackOnBody: true,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          delay: 120,
          delayOnTouchOnly: true,
          onStart: () => {
            dragging = true;
          },
          onEnd: (evt) => {
            dragging = false;
            droppedAt = Date.now();
            const cardId = evt.item.dataset.cardId;
            const columnId = evt.to.dataset.columnId;
            if (evt.to !== evt.from && cardId && columnId) {
              redrawAfterDrag = false;
              void place(cardId, columnId);
            } else if (redrawAfterDrag) {
              redrawAfterDrag = false;
              window.setTimeout(render, 0);
            }
          },
        }));
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
              ? 'Solid cards show where most people put each one; lighter cards are the other answers. Talk it through, choose where each card goes, then keep them on the board. You can also drag a solid card to another column, now or later.'
              : doneAll === total && total > 0
                ? 'Everyone has placed every card. Reveal when you’re ready.'
                : `${doneAll} of ${total} have placed every card. Reveal when everyone’s done.`),
        );
        if (round.revealed) {
          // Where each card goes: the vote unless she picks a column.
          const goesIn = el('div', { class: 'stages-goes-in' });
          for (const id of round.open) {
            const counts = tally[id]?.counts ?? {};
            const m = majority(counts);
            const chosen = placed[id] && columns.some((c) => c.id === placed[id]) ? placed[id] : '';
            const voteLabel = m.columns.length === 1
              ? `Most votes: ${columns.find((c) => c.id === m.columns[0])?.label ?? ''}`
              : m.columns.length > 1 ? 'Tied: choose a column' : 'No votes: choose a column';
            const selectId = `stages-goes-in-${stage}-${id}`;
            const select = el('select', {
              class: 'form-select',
              id: selectId,
              onChange: (e: Event) => {
                const value = (e.target as HTMLSelectElement).value;
                void place(id, value || null);
              },
            },
              el('option', { value: '' }, voteLabel),
              ...columns.map((c, i) => el('option', { value: c.id }, c.kind === 'stage' ? `${i + 1}. ${c.label}` : c.label)),
            ) as HTMLSelectElement;
            select.value = chosen;
            goesIn.append(el('div', { class: 'stages-goes-in__row' },
              el('label', { class: 'stages-goes-in__card', for: selectId }, `${cardLabel(id)} · ${m.total}/${total}`),
              select,
            ));
          }
          panel.append(goesIn);
        } else {
          const list = el('div', { class: 'stages-reveal__cards' });
          for (const id of round.open) {
            const n = tally[id] ? majority(tally[id].counts).total : 0;
            list.append(el('span', { class: 'stages-mini' }, `${cardLabel(id)} · ${n}/${total}`));
          }
          panel.append(list);
        }
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
          const lined = Array.from(picked[stage]).filter((id) => !round.open.includes(id) && !round.done.includes(id));
          panel.append(el('div', { class: 'stages-actions' },
            lined.length
              ? btn(`Keep these and send the ${lined.length === 1 ? 'card' : `${lined.length} cards`} lined up`, 'primary', async () => {
                  if (!(await act('closeRound', { stage }))) return;
                  if (await act('openCards', { stage, cardIds: lined })) {
                    picked[stage].clear();
                    rerender();
                  }
                })
              : btn('Keep these on the board and pick the next cards', 'primary', () => void act('closeRound', { stage })),
            lined.length ? btn('Keep these, send nothing yet', 'text', () => void act('closeRound', { stage })) : null,
          ));
        } else {
          panel.append(el('div', { class: 'stages-actions' },
            btn('Reveal', 'primary', () => void act('reveal', { stage }), { disabled: total === 0 }),
            participantsList((p) => (stage === 'stage2' ? p.stage2Placed : p.stage3Placed) >= round.open.length),
          ));
          panel.append(replacing[stage]
            ? el('div', { class: 'stages-actions' },
                el('p', { class: 'stages-note' }, 'Choose different cards below. Sending them takes these back and clears everyone’s answers to them.'),
                btn('Keep these cards', 'text', () => {
                  replacing[stage] = false;
                  rerender();
                }),
              )
            : el('div', { class: 'stages-actions' },
                btn('Take these cards back', 'text', () => {
                  if (!window.confirm('Take these cards back? Any answers to them so far will be cleared.')) return;
                  replacing[stage] = true;
                  rerender();
                }),
              ));
        }
        wrap.append(panel);
      }

      // Picker. While cards are out it stays open so the facilitator can
      // line up what goes next; those go out when she keeps the round.
      {
        const liningUp = round.open.length > 0 && !replacing[stage];
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
          linedNote.textContent = sel.size
            ? `${sel.size} lined up: ${Array.from(sel).map(cardLabel).join(', ')}.`
            : 'Nothing lined up yet.';
          filterChips();
        };
        const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const matching = () => {
          const q = normalise(search[stage]);
          return remaining.filter((c) => !q || normalise(c.label).includes(q));
        };
        const noMatch = el('p', { class: 'stages-note' });
        const filterChips = () => {
          const hits = new Set(matching().map((c) => c.id));
          for (const chip of chips) chip.hidden = !hits.has(chip.dataset.cardId!) && !sel.has(chip.dataset.cardId!);
          noMatch.textContent = hits.size ? '' : `No cards match “${search[stage]}”.`;
          noMatch.hidden = hits.size > 0;
        };
        const searchBox = el('input', {
          type: 'search',
          class: 'form-input stages-picker__search',
          placeholder: 'Search the cards',
          'aria-label': 'Search the cards',
          autocomplete: 'off',
          value: search[stage],
          dataset: { keepFocus: `picker-search-${stage}` },
        }) as HTMLInputElement;
        searchBox.addEventListener('input', () => {
          search[stage] = searchBox.value;
          filterChips();
        });
        // Enter picks the card when the search has narrowed it to one.
        searchBox.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const hits = matching();
          if (hits.length !== 1) return;
          sel.add(hits[0].id);
          search[stage] = '';
          searchBox.value = '';
          refreshChips();
        });
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
          const ok = await act('openCards', { stage, cardIds: ids, replace: replacing[stage] });
          if (ok) {
            sel.clear();
            // act() has already re-rendered with the picker open, and the
            // next poll sees no server change, so redraw now.
            replacing[stage] = false;
            rerender();
          }
        };
        const sendBtn = btn('Send selected', 'primary', () => void send(Array.from(sel)));
        const linedNote = el('p', { class: 'stages-note', 'aria-live': 'polite' });
        const header = el('div', { class: 'stages-picker__header' },
          el('h3', { class: 'stages-panel__title' },
            liningUp ? 'Line up the next cards' : round.open.length ? 'Choose different cards' : 'Choose the next cards'),
          el('span', { class: 'stages-deck__count' }, `${remaining.length} left`),
        );
        const clearBtn = btn('Clear selection', 'text', () => {
          sel.clear();
          refreshChips();
        });
        const actions = liningUp
          ? el('div', { class: 'stages-stack' },
              el('p', { class: 'stages-panel__text' }, 'Pick what goes out next. Nobody sees these until you keep the cards in play.'),
              el('div', { class: 'stages-actions' }, linedNote, clearBtn),
            )
          : el('div', { class: 'stages-actions' },
              sendBtn,
              btn('Send 1 at random', 'tint', () => void send(shuffle(remaining.map((c) => c.id)).slice(0, 1)), { disabled: !remaining.length }),
              btn('Send 3 at random', 'tint', () => void send(shuffle(remaining.map((c) => c.id)).slice(0, 3)), { disabled: remaining.length < 1 }),
              clearBtn,
            );
        refreshChips();
        if (remaining.length || !liningUp) wrap.append(el('div', { class: 'stages-panel stages-picker' }, header, actions, searchBox, noMatch, listEl));
      }

      // Navigation between stages
      const nav = el('div', { class: 'stages-actions' });
      const navWeight = round.open.length ? 'tint' : 'primary';
      if (stage === 'stage2') {
        nav.append(
          btn('Show the key points from Stage 2', navWeight, () => void act('setStep', { step: 'recap2' })),
          btn('Skip to Stage 3', 'tint', () => {
            const started = view!.session.stage3.open.length || view!.session.stage3.done.length;
            void act('setStep', { step: started ? 'stage3' : 'intro3' });
          }),
        );
      } else {
        nav.append(
          btn('Show the key points from Stage 3', navWeight, () => void act('setStep', { step: 'recap3' })),
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
