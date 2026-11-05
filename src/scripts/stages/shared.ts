/**
 * Stages in Relationships — client helpers shared by the solo, host and
 * join scripts. No framework: small DOM helpers, fetch wrappers, a
 * polling loop, and the column-label logic every screen needs.
 *
 * Card data is imported directly (it is plain TS) so the client and
 * server always agree on ids and labels. Types from the store module
 * are type-only imports, so nothing server-side is bundled.
 */

import qrcode from 'qrcode-generator';
import Sortable from 'sortablejs';
import {
  CLOSING_MESSAGES,
  getRecap,
  getSlide,
  isIntroId,
  isRecapId,
  isSlideId,
  slideBeats,
  type IntroId,
  type Recap,
  type RecapId,
  type Slide,
  type SlideId,
} from '../../data/stages-recaps';
import {
  NEVER_COLUMN_ID,
  OUT_PILE_ID,
  STAGE_CARDS,
  deckCards,
  getCard,
  type Card,
  type DeckId,
} from '../../data/stages-in-relationships';
import type { Participant, RoundState, Session, Step } from '../../lib/stages-store';

export { NEVER_COLUMN_ID, OUT_PILE_ID, STAGE_CARDS, deckCards, getCard, Sortable };
export { CLOSING_MESSAGES, getRecap, getSlide, isIntroId, isRecapId, isSlideId, slideBeats };
export type { IntroId, Recap, RecapId, Slide, SlideId };
export type { Card, DeckId, Participant, RoundState, Session, Step };

export type PublicSession = Omit<Session, 'hostToken' | 'screenToken'>;

export const BASE_PATH = '/tools/stages-in-relationships';
export const POLL_MS = 2500;

// ─── DOM ─────────────────────────────────────────────────────────────

type Child = Node | string | null | undefined | false;

/** Tiny element builder: el('div', { class: 'x', onClick }, 'text', node). */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, unknown> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = String(value);
    else if (key === 'dataset') Object.assign(node.dataset, value as Record<string, string>);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key === 'text') node.textContent = String(value);
    else if (key === 'html') node.innerHTML = String(value);
    else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, String(value));
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return node;
}

export function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function $<T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`Missing element: ${selector}`);
  return found;
}

export function $$<T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** Button with the design system's three-layer class structure. */
export function btn(
  label: string,
  style: 'primary' | 'tint' | 'text' | 'danger-text',
  onClick: (ev: MouseEvent) => void,
  opts: { small?: boolean; disabled?: boolean; title?: string } = {},
): HTMLButtonElement {
  const b = el('button', {
    type: 'button',
    class: `btn ${opts.small ? 'btn--sm' : 'btn--std'} btn--${style}${opts.disabled ? ' btn--disabled' : ''}`,
    disabled: opts.disabled,
    title: opts.title,
    onClick,
  }, label);
  return b;
}

/**
 * A QR code for a link, as an inline SVG. Dark squares on a light tile
 * in both themes: not every phone camera reads a light-on-dark code.
 */
export function qrCode(text: string, label: string): SVGSVGElement {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 4; // the blank border scanners need, in modules
  const size = n + quiet * 2;
  let d = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
  }
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', 'stages-qr');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  svg.setAttribute('shape-rendering', 'crispEdges');
  const tile = document.createElementNS(ns, 'rect');
  tile.setAttribute('class', 'stages-qr__tile');
  tile.setAttribute('width', String(size));
  tile.setAttribute('height', String(size));
  const marks = document.createElementNS(ns, 'path');
  marks.setAttribute('class', 'stages-qr__marks');
  marks.setAttribute('d', d);
  svg.append(tile, marks);
  return svg;
}

// ─── Cards & columns ────────────────────────────────────────────────

export function shuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function columnLabel(columnId: string): string {
  if (columnId === NEVER_COLUMN_ID) return 'Never';
  if (columnId === OUT_PILE_ID) return 'Not on the timeline';
  return getCard(columnId)?.label ?? columnId;
}

export function cardLabel(cardId: string): string {
  return getCard(cardId)?.label ?? cardId;
}

/** Which deck a card belongs to, from its id prefix. Drives the colour. */
export function deckOf(cardId: string): DeckId {
  if (cardId.startsWith('a-')) return 'activities';
  if (cardId.startsWith('f-')) return 'fluids';
  return 'stages';
}

/** Small coloured chip for a card (used inside option buttons, roundups). */
export function miniEl(cardId: string, extraClass = ''): HTMLElement {
  return el('span', { class: `stages-mini stages-mini--${deckOf(cardId)}${extraClass ? ` ${extraClass}` : ''}` }, cardLabel(cardId));
}

export interface CardElOptions {
  static?: boolean;
  extraClass?: string;
  count?: number;
  onRemove?: () => void;
  removeTitle?: string;
}

/** A card on the board. */
export function cardEl(card: Card, opts: CardElOptions = {}): HTMLElement {
  const node = el('div', {
    class: `stages-card stages-card--${deckOf(card.id)}${opts.static ? ' stages-card--static' : ''}${opts.extraClass ? ` ${opts.extraClass}` : ''}`,
    dataset: { cardId: card.id },
    tabindex: opts.static ? undefined : '0',
  },
    el('span', { class: 'stages-card__label' }, card.label),
    opts.count != null ? el('span', { class: 'stages-card__count', title: `${opts.count} placed it here` }, `×${opts.count}`) : null,
    opts.onRemove
      ? el('button', {
          type: 'button',
          class: 'stages-card__remove',
          'aria-label': opts.removeTitle ?? `Remove ${card.label}`,
          title: opts.removeTitle ?? 'Remove',
          onClick: (e: Event) => { e.stopPropagation(); opts.onRemove?.(); },
        }, '×')
      : null,
  );
  return node;
}

export interface ColumnSpec {
  id: string;
  label: string;
  kind?: 'stage' | 'never' | 'out';
}

/** Columns for Stages 2 and 3: the agreed timeline, then "Never". */
export function timelineColumns(timeline: string[]): ColumnSpec[] {
  const cols: ColumnSpec[] = timeline.map((id) => ({ id, label: columnLabel(id), kind: 'stage' }));
  cols.push({ id: NEVER_COLUMN_ID, label: 'Never', kind: 'never' });
  return cols;
}

/** Render empty columns into `board`; returns the body element per column id. */
export function renderColumns(
  board: HTMLElement,
  columns: ColumnSpec[],
  opts: { fill?: boolean } = {},
): Map<string, HTMLElement> {
  clear(board);
  const row = el('div', { class: `stages-board__columns${opts.fill ? ' stages-board__columns--fill' : ''}` });
  const bodies = new Map<string, HTMLElement>();
  columns.forEach((col, i) => {
    const body = el('div', { class: 'stages-column__body', dataset: { columnId: col.id } });
    const title = el('h3', { class: 'stages-column__title' },
      el('span', {}, col.kind === 'stage' ? `${i + 1}. ${col.label}` : col.label),
      el('span', { class: 'stages-column__count', dataset: { columnCount: col.id } }),
    );
    const column = el('section', {
      class: `stages-column${col.kind === 'never' ? ' stages-column--never' : ''}${col.kind === 'out' ? ' stages-column--out' : ''}`,
      'aria-label': col.label,
    }, title, body);
    row.append(column);
    bodies.set(col.id, body);
  });
  board.append(row);
  return bodies;
}

/** Placement counts per card: { [cardId]: { counts: { [columnId]: n } } },
 *  plus who chose each column when names are allowed. */
export interface CardTally {
  [cardId: string]: { counts: Record<string, number>; names?: Record<string, string[]> };
}

/**
 * The Stage 2 / 3 board, drawn the same on the control desk and the
 * presenter screen. Kept cards sit in the column the facilitator put
 * them in (`placed`), or else the one most people chose; Stage 3 also
 * shows the Stage 2 cards, so the fluids can be read against them; once
 * revealed, every answer for the cards in play is shown. `tally` must
 * cover the kept cards and, when revealed, the open ones. `onRemove`
 * adds the control desk's "take off the board" button; `movable` marks
 * the cards the desk can drag to another column. `spotlight` is a kept
 * card shown again in every column people chose, with the rest of the
 * board faded; `onPick` makes kept cards clickable to choose it.
 */
export function placementBoard(opts: {
  stage: 'stage2' | 'stage3';
  timeline: string[];
  round: { open: string[]; revealed: boolean; done: string[] };
  tally: CardTally;
  stage2Board: Record<string, string>;
  placed?: Record<string, string>;
  onRemove?: (cardId: string) => void;
  movable?: boolean;
  spotlight?: string | null;
  onPick?: (cardId: string) => void;
  pickHint?: string;
}): HTMLElement[] {
  const { stage, round, tally } = opts;
  const spotlight = opts.spotlight && round.done.includes(opts.spotlight) ? opts.spotlight : null;
  const board = el('div', { class: `stages-board${spotlight ? ' stages-board--spotlight' : ''}` });
  const bodies = renderColumns(board, timelineColumns(opts.timeline), { fill: true });
  const movable = opts.movable ? ' stages-card--movable' : '';
  // Kept cards become buttons when the viewer can pick one out.
  const pickable = (node: HTMLElement) => {
    if (!opts.onPick) return node;
    const id = node.dataset.cardId!;
    const label = getCard(id)?.label ?? id;
    node.classList.add('stages-card--pickable');
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-pressed', id === spotlight ? 'true' : 'false');
    node.setAttribute('aria-label', id === spotlight ? `Hide where everyone put ${label}` : `Show where everyone put ${label}`);
    node.addEventListener('click', () => opts.onPick!(id));
    node.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      opts.onPick!(id);
    });
    return node;
  };
  const unplaced: string[] = [];
  for (const id of round.done) {
    const t = tally[id];
    const card = getCard(id);
    if (!card) continue;
    const m = t ? majority(t.counts) : { columns: [], max: 0, total: 0 };
    const chosen = placedIn(opts.placed, id, bodies);
    const col = chosen ?? m.columns[0];
    const body = col ? bodies.get(col) : undefined;
    if (!body) {
      unplaced.push(id);
      continue;
    }
    const n = t?.counts[col] ?? 0;
    const lit = id === spotlight ? ' stages-card--spotlight' : '';
    body.append(pickable(cardEl(card, {
      static: true,
      count: n || undefined,
      extraClass: `stages-card--done${!chosen && m.columns.length > 1 ? ' stages-card--split' : ''}${movable}${lit}`,
      onRemove: opts.onRemove ? () => opts.onRemove!(id) : undefined,
      removeTitle: `Take “${card.label}” off the board`,
    })));
    // Picked out: everyone's other answers come back, as at the reveal.
    if (lit && t) {
      for (const [other, count] of Object.entries(t.counts)) {
        const otherBody = bodies.get(other);
        if (other === col || !count || !otherBody) continue;
        otherBody.append(pickable(cardEl(card, { static: true, count, extraClass: 'stages-card--minority stages-card--spotlight' })));
      }
    }
  }
  if (stage === 'stage3') {
    for (const [id, col] of Object.entries(opts.stage2Board)) {
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
      // Once the facilitator has put the card somewhere, that copy is the
      // solid one, even in a column nobody chose.
      const chosen = placedIn(opts.placed, id, bodies);
      const solid = chosen ? [chosen] : m.columns;
      const split = !chosen && m.columns.length > 1;
      const counts = chosen && !t.counts[chosen] ? { ...t.counts, [chosen]: 0 } : t.counts;
      for (const [col, n] of Object.entries(counts)) {
        const body = bodies.get(col);
        if (!body || (!n && col !== chosen)) continue;
        const isSolid = solid.includes(col);
        body.append(cardEl(card, {
          static: true,
          count: n || undefined,
          extraClass: `${isSolid ? `stages-card--majority${movable}` : 'stages-card--minority'}${isSolid && split ? ' stages-card--split' : ''}`,
        }));
      }
    }
  }
  updateColumnCounts(board);
  const spotCard = spotlight ? getCard(spotlight) : null;
  const out: HTMLElement[] = [
    board,
    el('p', { class: 'stages-key' },
      el('span', { class: 'stages-key__item' }, el('span', { class: 'stages-key__swatch', 'aria-hidden': 'true' }), 'Activities'),
      stage === 'stage3' ? el('span', { class: 'stages-key__item' }, el('span', { class: 'stages-key__swatch stages-key__swatch--fluids', 'aria-hidden': 'true' }), 'Stage 3 cards') : null,
      el('span', { class: 'stages-key__item' }, opts.placed && Object.keys(opts.placed).length
        ? 'Solid = where it goes · pale = other answers · dashed = a tie'
        : 'Solid = where most people put it · pale = other answers · dashed = a tie'),
    ),
  ];
  if (unplaced.length) out.push(el('p', { class: 'stages-note' }, `Nobody placed: ${unplaced.map(cardLabel).join(', ')}.`));
  if (spotCard) {
    out.unshift(el('p', { class: 'stages-spotlight-note', 'aria-live': 'polite' },
      'Where everyone put ', el('strong', {}, `“${spotCard.label}”`),
      opts.pickHint ? el('span', { class: 'stages-note' }, ` ${opts.pickHint}`) : null,
    ));
  }
  return out;
}

/** The facilitator's column for a card, if it is still on the board. */
function placedIn(placed: Record<string, string> | undefined, cardId: string, bodies: Map<string, HTMLElement>): string | null {
  const col = placed?.[cardId];
  return col && bodies.has(col) ? col : null;
}

export function updateColumnCounts(board: HTMLElement): void {
  for (const counter of $$('[data-column-count]', board)) {
    const id = counter.dataset.columnCount!;
    const body = board.querySelector<HTMLElement>(`[data-column-id="${CSS.escape(id)}"]`);
    const n = body ? body.querySelectorAll('.stages-card').length : 0;
    counter.textContent = n ? String(n) : '';
  }
}

// ─── Storage (per-browser conveniences; never the source of truth) ──

export function loadLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveLocal(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — the page still works without it */
  }
}

export function removeLocal(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

// ─── API ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/stages/${path}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new ApiError(data.error ?? `Request failed (${res.status})`, res.status);
  return data;
}

export async function apiGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/stages/${path}/?${qs}`, { cache: 'no-store' });
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new ApiError(data.error ?? `Request failed (${res.status})`, res.status);
  return data;
}

/** Poll `tick` every `intervalMs` while the page is visible; retries
 *  quietly on network errors and reports the latest error via
 *  `onError` so the screen can show "reconnecting". */
export function startPolling(
  tick: () => Promise<void>,
  intervalMs: number,
  onError: (err: unknown) => void,
): { stop: () => void; now: () => Promise<void> } {
  let stopped = false;
  let timer: number | undefined;
  let running = false;

  const run = async () => {
    if (stopped || running) return;
    running = true;
    try {
      await tick();
      onError(null);
    } catch (err) {
      onError(err);
    } finally {
      running = false;
      if (!stopped) {
        const delay = document.hidden ? intervalMs * 4 : intervalMs;
        timer = window.setTimeout(run, delay);
      }
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !stopped) {
      window.clearTimeout(timer);
      void run();
    }
  });

  void run();
  return {
    stop: () => { stopped = true; window.clearTimeout(timer); },
    now: async () => { window.clearTimeout(timer); await run(); },
  };
}

// ─── Misc ───────────────────────────────────────────────────────────

export function stepLabel(step: Step): string {
  switch (step) {
    case 'lobby': return 'Welcome';
    case 'intro1': return 'Stage 1 · What to expect';
    case 'stage1': return 'Stage 1 · Timeline';
    case 'recap1': return 'Stage 1 · Key points';
    case 'intro2': return 'Stage 2 · What to expect';
    case 'stage2': return 'Stage 2 · Activities';
    case 'recap2': return 'Stage 2 · Key points';
    case 'intro3': return 'Stage 3 · What to expect';
    // The group sees this on the presenter screen, so it doesn't name the
    // round: they find out it's about sharing fluids from the cards.
    case 'stage3': return 'Stage 3';
    case 'recap3': return 'Stage 3 · Key points';
    case 'end': return 'Finished';
  }
}

export function joinUrl(code: string): string {
  return `${location.origin}${BASE_PATH}/join/?code=${code}`;
}

/** The presenter screen's link. The key rides in the fragment, so it is
 *  never sent with the page request; the screen passes it to the API. */
export function screenUrl(code: string, screenToken: string): string {
  return `${location.origin}${BASE_PATH}/screen/?code=${code}#k=${screenToken}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Majority column for a card given { columnId: count }. Ties → all
 *  tied columns are returned. */
export function majority(counts: Record<string, number>): { columns: string[]; max: number; total: number } {
  let max = 0;
  let total = 0;
  for (const n of Object.values(counts)) {
    total += n;
    if (n > max) max = n;
  }
  const columns = Object.entries(counts).filter(([, n]) => n === max && n > 0).map(([c]) => c);
  return { columns, max, total };
}

// ─── End-of-session roundup ─────────────────────────────────────────

export interface Summary {
  participants: number;
  stage1: { submitted: number; timeline: string[]; items: { cardId: string; spread: number; median: number; outCount: number; placedCount: number }[] };
  stage2: { cardId: string; columnId: string | null; max: number; total: number; agreement: number }[];
  stage3: { cardId: string; columnId: string | null; max: number; total: number; agreement: number }[];
}

/** Agreement roundup shared by the phone and the host screen. */
export function roundupEl(summary: Summary): HTMLElement {
  const pctClass = (pct: number) => pct >= 75 ? ' stages-roundup__pct--high' : pct < 50 ? ' stages-roundup__pct--low' : '';
  const placementList = (items: Summary['stage2']) => {
    const list = el('ul', { class: 'stages-roundup__list' });
    for (const it of items) {
      list.append(
        el('li', { class: 'stages-roundup__row' },
          el('span', {}, miniEl(it.cardId), ' ', el('span', { class: 'stages-roundup__where' }, it.columnId ? `→ ${columnLabel(it.columnId)}` : '')),
          el('span', { class: `stages-roundup__pct${pctClass(it.agreement)}`, title: `${it.max} of ${it.total}` }, `${it.agreement}% agreed`),
        ),
      );
    }
    return list;
  };
  const panels: HTMLElement[] = [];

  const s1 = summary.stage1.items;
  if (summary.stage1.submitted > 1 && s1.length) {
    const list = el('ul', { class: 'stages-roundup__list' });
    for (const it of s1) {
      const n = summary.stage1.submitted;
      const mixed = it.outCount > 0 && it.placedCount > 0;
      const label = it.placedCount === 0
        ? 'everyone left it off'
        : mixed ? `${it.outCount} of ${n} left it off` : `±${it.spread} places`;
      const tone = mixed ? ' stages-roundup__pct--low' : it.placedCount === 0 || it.spread <= 1 ? ' stages-roundup__pct--high' : it.spread >= 4 ? ' stages-roundup__pct--low' : '';
      list.append(
        el('li', { class: 'stages-roundup__row' },
          el('span', {}, miniEl(it.cardId)),
          el('span', { class: `stages-roundup__pct${tone}` }, label),
        ),
      );
    }
    panels.push(el('div', { class: 'stages-panel' },
      el('h3', { class: 'stages-panel__title' }, 'Stage 1: where people agreed'),
      el('p', { class: 'stages-panel__text' }, 'Most agreed at the top: how far people’s positions were from the middle answer.'),
      list,
    ));
  }
  if (summary.stage2.length) {
    panels.push(el('div', { class: 'stages-panel' },
      el('h3', { class: 'stages-panel__title' }, 'Stage 2: activities'),
      el('p', { class: 'stages-panel__text' }, 'Share of the group who put each card where most people did.'),
      placementList(summary.stage2),
    ));
  }
  if (summary.stage3.length) {
    panels.push(el('div', { class: 'stages-panel' },
      el('h3', { class: 'stages-panel__title' }, 'Stage 3: sharing fluids'),
      el('p', { class: 'stages-panel__text' }, 'Same measure. Look at what everyone said “never” to, next to where kissing landed.'),
      placementList(summary.stage3),
    ));
  }
  if (!panels.length) return el('p', { class: 'stages-note' }, 'No rounds were completed, so there is nothing to round up.');
  return el('div', { class: 'stages-roundup' }, ...panels);
}

// ─── Slides: the intro before each stage and the recap after it ─────

export interface SlideOptions {
  /** How many points are showing. Omitted means all of them. */
  shown?: number;
  /** The facilitator's copy: points not yet shown are drawn faded with
   *  "Coming up" instead of being hidden, so she can see what's next. */
  preview?: boolean;
}

/**
 * An intro or recap slide, built up one point at a time. Rendered the
 * same on the host's desk, the presenter screen and every phone; the CSS
 * scales the type. Points not yet shown keep their space (hidden, not
 * removed) so the slide doesn't jump as it builds, as on a presentation.
 */
let lastArrival = '';

export function slideEl(slide: Slide, opts: SlideOptions = {}): HTMLElement {
  const total = slideBeats(slide);
  const shown = Math.min(opts.shown ?? total, total);
  // Only the point that has just been revealed fades in, and only once:
  // a redraw for some other reason leaves it still.
  const arrival = `${slide.id}:${shown}`;
  const arriving = !opts.preview && opts.shown !== undefined && shown > 0 && arrival !== lastArrival ? shown - 1 : -1;
  if (!opts.preview) lastArrival = arrival;
  let beat = 0;
  const state = (): { cls: string; label: string | null } => {
    const i = beat++;
    if (i < shown) return { cls: i === arriving ? ' is-shown is-arriving' : ' is-shown', label: null };
    if (!opts.preview) return { cls: ' is-hidden', label: null };
    return i === shown
      ? { cls: ' is-upcoming is-next', label: 'Next click' }
      : { cls: ' is-upcoming', label: 'Coming up' };
  };
  const attrs = (cls: string, base: string) => ({
    class: base + cls,
    'data-beat': String(beat - 1),
    'aria-hidden': cls.includes('is-hidden') ? 'true' : undefined,
  });
  const upcoming = (label: string | null) => label ? el('span', { class: 'stages-slide__upcoming' }, label) : null;

  const section = el('section', { class: `stages-slide stages-slide--${slide.deck} stages-slide--${slide.kind}`, 'aria-label': slide.title },
    el('p', { class: 'stages-slide__eyebrow' }, slide.eyebrow),
    el('h2', { class: 'stages-slide__title' }, slide.title),
  );

  if (slide.key.length) {
    const key = el('ol', { class: 'stages-slide__key' });
    for (const p of slide.key) {
      const st = state();
      key.append(
        el('li', attrs(st.cls, 'stages-slide__key-point'),
          el('p', { class: 'stages-slide__key-label' }, 'Key message', upcoming(st.label)),
          el('h3', { class: 'stages-slide__key-heading' }, p.heading),
          el('p', { class: 'stages-slide__key-body' }, p.body),
        ),
      );
    }
    section.append(key);
  }

  if (slide.points.length) {
    const firstPoint = beat;
    const list = el('ol', { class: 'stages-slide__points' });
    for (const p of slide.points) {
      const st = state();
      list.append(
        el('li', attrs(st.cls, 'stages-slide__point'),
          el('h3', { class: 'stages-slide__point-heading' }, p.heading, upcoming(st.label)),
          el('p', { class: 'stages-slide__point-body' }, p.body),
        ),
      );
    }
    // On a recap, the supporting points sit under their own heading,
    // which appears with the first of them.
    if (slide.key.length) {
      const headingShown = firstPoint < shown || opts.preview;
      section.append(el('h3', {
        class: `stages-slide__also${headingShown ? '' : ' is-hidden'}`,
        'aria-hidden': headingShown ? undefined : 'true',
      }, 'Also from this round'));
    }
    section.append(list);
  }

  if (slide.closer) {
    const st = state();
    section.append(el('p', attrs(st.cls, 'stages-slide__closer'), slide.closer, upcoming(st.label)));
  }
  return section;
}

/** The heading of the point the next click shows, or null when the
 *  slide is complete. */
export function nextBeatLabel(slide: Slide, shown: number): string | null {
  const beats = [...slide.key.map((p) => p.heading), ...slide.points.map((p) => p.heading)];
  if (slide.closer) beats.push('The closing line');
  return shown < beats.length ? beats[shown] : null;
}

/** Bring the newest point into view on a screen someone can scroll. */
export function scrollToLatestBeat(root: HTMLElement, shown: number): void {
  if (shown <= 0) return;
  const latest = root.querySelector<HTMLElement>(`[data-beat="${shown - 1}"]`);
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  latest?.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
}

/** The old name, kept for callers that show a whole recap at once. */
export function recapSlide(recap: Recap): HTMLElement {
  return slideEl(recap);
}

/** The three one-line takeaways, for the closing screen. */
export function closingMessagesEl(): HTMLElement {
  const list = el('ol', { class: 'stages-takeaways' });
  CLOSING_MESSAGES.forEach((m, i) => {
    list.append(
      el('li', { class: `stages-takeaways__item stages-takeaways__item--${m.deck}` },
        el('span', { class: 'stages-takeaways__num', 'aria-hidden': 'true' }, String(i + 1)),
        el('span', {}, m.text),
      ),
    );
  });
  return list;
}
