/**
 * Stages in Relationships — client helpers shared by the solo, host and
 * join scripts. No framework: small DOM helpers, fetch wrappers, a
 * polling loop, and the column-label logic every screen needs.
 *
 * Card data is imported directly (it is plain TS) so the client and
 * server always agree on ids and labels. Types from the store module
 * are type-only imports, so nothing server-side is bundled.
 */

import Sortable from 'sortablejs';
import { CLOSING_MESSAGES, getRecap, isRecapId, type Recap, type RecapId } from '../../data/stages-recaps';
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
export { CLOSING_MESSAGES, getRecap, isRecapId };
export type { Recap, RecapId };
export type { Card, DeckId, Participant, RoundState, Session, Step };

export type PublicSession = Omit<Session, 'hostToken'>;

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

export function timelineColumns(timeline: string[], withNever: boolean): ColumnSpec[] {
  const cols: ColumnSpec[] = timeline.map((id) => ({ id, label: columnLabel(id), kind: 'stage' }));
  if (withNever) cols.push({ id: NEVER_COLUMN_ID, label: 'Never', kind: 'never' });
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
    case 'stage1': return 'Stage 1 · Timeline';
    case 'recap1': return 'Stage 1 · Key points';
    case 'stage2': return 'Stage 2 · Activities';
    case 'recap2': return 'Stage 2 · Key points';
    case 'stage3': return 'Stage 3 · Sharing fluids';
    case 'recap3': return 'Stage 3 · Key points';
    case 'end': return 'Finished';
  }
}

export function joinUrl(code: string): string {
  return `${location.origin}${BASE_PATH}/join/?code=${code}`;
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

// ─── Section-break slides ───────────────────────────────────────────

/**
 * A section-break screen. Rendered identically on the host's shared
 * screen and on every participant's phone; the CSS scales the type.
 */
export function recapSlide(recap: Recap): HTMLElement {
  const points = el('ol', { class: 'stages-slide__points' });
  for (const p of recap.points) {
    points.append(
      el('li', { class: 'stages-slide__point' },
        el('h3', { class: 'stages-slide__point-heading' }, p.heading),
        el('p', { class: 'stages-slide__point-body' }, p.body),
      ),
    );
  }
  return el('section', { class: `stages-slide stages-slide--${recap.deck}`, 'aria-label': recap.title },
    el('p', { class: 'stages-slide__eyebrow' }, recap.eyebrow),
    el('h2', { class: 'stages-slide__title' }, recap.title),
    points,
    el('p', { class: 'stages-slide__closer' }, recap.closer),
  );
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
