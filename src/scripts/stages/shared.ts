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
    class: `stages-card${opts.static ? ' stages-card--static' : ''}${opts.extraClass ? ` ${opts.extraClass}` : ''}`,
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
    case 'lobby': return 'Lobby';
    case 'stage1': return 'Stage 1 · Timeline';
    case 'stage2': return 'Stage 2 · Activities';
    case 'stage3': return 'Stage 3 · Sharing fluids';
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
