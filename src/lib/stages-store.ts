/**
 * Stages in Relationships — live session storage.
 *
 * One facilitator ("host") runs a session; participants join with a
 * six-character code from their own devices. State lives in Redis
 * (REDIS_URL, the same instance the book-order flow uses) so it is
 * shared across serverless instances. When REDIS_URL is absent (local
 * dev) an in-memory store is used instead — fine for one dev server,
 * useless on Vercel, so the API refuses to create sessions in
 * production without Redis rather than silently losing state.
 *
 * Keys (all expire SESSION_TTL_SECONDS after the last host write):
 *   stages:{code}      JSON Session (host-owned; only host routes write it)
 *   stages:{code}:p    Hash pid → JSON Participant (each participant
 *                      writes only their own field, so there is no
 *                      read-modify-write race between people)
 */

import { createClient } from 'redis';
import {
  NEVER_COLUMN_ID,
  OUT_PILE_ID,
  STAGE_CARDS,
  deckCards,
  isKnownCard,
  type DeckId,
} from '../data/stages-in-relationships';

export const SESSION_TTL_SECONDS = 24 * 60 * 60;
export const MAX_PARTICIPANTS = 60;
export const MAX_NAME_LENGTH = 24;

export type Step = 'lobby' | 'stage1' | 'stage2' | 'stage3' | 'end';
export type PlacementStage = 'stage2' | 'stage3';

export interface RoundState {
  /** Cards participants are currently placing. */
  open: string[];
  /** Whether the host has revealed the placements for the open cards. */
  revealed: boolean;
  /** Cards already discussed, in the order they were closed. Their
   *  majority column is recomputed from participant records. */
  done: string[];
}

export interface Session {
  code: string;
  hostToken: string;
  createdAt: number;
  updatedAt: number;
  /** Bumped on every host write; clients use it to detect change. */
  version: number;
  hideExplicit: boolean;
  step: Step;
  stage1: { open: boolean; revealed: boolean };
  /** Agreed timeline after Stage 1 — stage-card ids in order. These
   *  become the columns for Stages 2 and 3. */
  timeline: string[];
  stage2: RoundState;
  stage3: RoundState;
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: number;
  lastSeen: number;
  updatedAt: number;
  stage1: { order: string[]; out: string[]; submitted: boolean } | null;
  /** cardId → columnId (a timeline stage-card id, or NEVER_COLUMN_ID). */
  stage2: Record<string, string>;
  stage3: Record<string, string>;
}

// ─── Storage backends ────────────────────────────────────────────────

interface Store {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown, ttlSeconds: number): Promise<void>;
  hGet(key: string, field: string): Promise<string | null>;
  hSet(key: string, field: string, value: string): Promise<void>;
  hDel(key: string, field: string): Promise<void>;
  hGetAll(key: string): Promise<Record<string, string>>;
  hLen(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<void>;
  del(...keys: string[]): Promise<void>;
  readonly kind: 'redis' | 'memory';
}

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({ url: import.meta.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis error:', err));
  }
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

const redisStore: Store = {
  kind: 'redis',
  async getJSON<T>(key: string) {
    const raw = await (await getRedis()).get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  async setJSON(key, value, ttlSeconds) {
    await (await getRedis()).set(key, JSON.stringify(value), { EX: ttlSeconds });
  },
  async hGet(key, field) {
    const v = await (await getRedis()).hGet(key, field);
    return v ?? null;
  },
  async hSet(key, field, value) {
    await (await getRedis()).hSet(key, field, value);
  },
  async hDel(key, field) {
    await (await getRedis()).hDel(key, field);
  },
  async hGetAll(key) {
    return (await getRedis()).hGetAll(key);
  },
  async hLen(key) {
    return (await getRedis()).hLen(key);
  },
  async expire(key, ttlSeconds) {
    await (await getRedis()).expire(key, ttlSeconds);
  },
  async del(...keys) {
    if (keys.length) await (await getRedis()).del(keys);
  },
};

// In-memory fallback for local development only.
const memStrings = new Map<string, { value: string; expiresAt: number }>();
const memHashes = new Map<string, { fields: Map<string, string>; expiresAt: number }>();

function sweepMemory() {
  const now = Date.now();
  for (const [k, v] of memStrings) if (v.expiresAt < now) memStrings.delete(k);
  for (const [k, v] of memHashes) if (v.expiresAt < now) memHashes.delete(k);
}

const memoryStore: Store = {
  kind: 'memory',
  async getJSON<T>(key: string) {
    sweepMemory();
    const hit = memStrings.get(key);
    return hit ? (JSON.parse(hit.value) as T) : null;
  },
  async setJSON(key, value, ttlSeconds) {
    memStrings.set(key, { value: JSON.stringify(value), expiresAt: Date.now() + ttlSeconds * 1000 });
  },
  async hGet(key, field) {
    sweepMemory();
    return memHashes.get(key)?.fields.get(field) ?? null;
  },
  async hSet(key, field, value) {
    let h = memHashes.get(key);
    if (!h) {
      h = { fields: new Map(), expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 };
      memHashes.set(key, h);
    }
    h.fields.set(field, value);
  },
  async hDel(key, field) {
    memHashes.get(key)?.fields.delete(field);
  },
  async hGetAll(key) {
    sweepMemory();
    return Object.fromEntries(memHashes.get(key)?.fields ?? []);
  },
  async hLen(key) {
    sweepMemory();
    return memHashes.get(key)?.fields.size ?? 0;
  },
  async expire(key, ttlSeconds) {
    const s = memStrings.get(key);
    if (s) s.expiresAt = Date.now() + ttlSeconds * 1000;
    const h = memHashes.get(key);
    if (h) h.expiresAt = Date.now() + ttlSeconds * 1000;
  },
  async del(...keys) {
    for (const k of keys) {
      memStrings.delete(k);
      memHashes.delete(k);
    }
  },
};

export function hasRedis(): boolean {
  return Boolean(import.meta.env.REDIS_URL);
}

export function getStore(): Store {
  return hasRedis() ? redisStore : memoryStore;
}

// ─── Keys, codes, tokens ────────────────────────────────────────────

const sessionKey = (code: string) => `stages:${code}`;
const participantsKey = (code: string) => `stages:${code}:p`;

/** Unambiguous alphabet: no 0/O, 1/I. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomFrom(alphabet: string, length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

export function normaliseCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 6) return null;
  for (const ch of code) if (!CODE_ALPHABET.includes(ch)) return null;
  return code;
}

export function isValidToken(raw: unknown): raw is string {
  return typeof raw === 'string' && /^[A-Za-z0-9]{32}$/.test(raw);
}

export function isValidPid(raw: unknown): raw is string {
  return typeof raw === 'string' && /^[A-Za-z0-9]{16}$/.test(raw);
}

// ─── Session lifecycle ──────────────────────────────────────────────

export async function createSession(hideExplicit: boolean): Promise<Session> {
  const store = getStore();
  // Retry on the (astronomically unlikely) code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomFrom(CODE_ALPHABET, 6);
    if (await store.getJSON(sessionKey(code))) continue;
    const now = Date.now();
    const session: Session = {
      code,
      hostToken: randomFrom('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 32),
      createdAt: now,
      updatedAt: now,
      version: 1,
      hideExplicit,
      step: 'lobby',
      stage1: { open: false, revealed: false },
      timeline: [],
      stage2: { open: [], revealed: false, done: [] },
      stage3: { open: [], revealed: false, done: [] },
    };
    await store.setJSON(sessionKey(code), session, SESSION_TTL_SECONDS);
    return session;
  }
  throw new Error('Could not allocate a session code');
}

export async function loadSession(code: string): Promise<Session | null> {
  return getStore().getJSON<Session>(sessionKey(code));
}

export async function saveSession(session: Session): Promise<void> {
  session.version += 1;
  session.updatedAt = Date.now();
  const store = getStore();
  await store.setJSON(sessionKey(session.code), session, SESSION_TTL_SECONDS);
  await store.expire(participantsKey(session.code), SESSION_TTL_SECONDS);
}

export async function deleteSession(code: string): Promise<void> {
  await getStore().del(sessionKey(code), participantsKey(code));
}

// ─── Participants ───────────────────────────────────────────────────

export function cleanName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);
}

export async function addParticipant(code: string, name: string): Promise<Participant | 'full'> {
  const store = getStore();
  const key = participantsKey(code);
  if ((await store.hLen(key)) >= MAX_PARTICIPANTS) return 'full';
  const now = Date.now();
  const participant: Participant = {
    id: randomFrom('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 16),
    name,
    joinedAt: now,
    lastSeen: now,
    updatedAt: now,
    stage1: null,
    stage2: {},
    stage3: {},
  };
  await store.hSet(key, participant.id, JSON.stringify(participant));
  await store.expire(key, SESSION_TTL_SECONDS);
  return participant;
}

export async function loadParticipant(code: string, pid: string): Promise<Participant | null> {
  const raw = await getStore().hGet(participantsKey(code), pid);
  return raw ? (JSON.parse(raw) as Participant) : null;
}

export async function saveParticipant(code: string, participant: Participant): Promise<void> {
  participant.updatedAt = Date.now();
  await getStore().hSet(participantsKey(code), participant.id, JSON.stringify(participant));
}

export async function touchParticipant(code: string, pid: string): Promise<Participant | null> {
  const p = await loadParticipant(code, pid);
  if (!p) return null;
  // Only write when the timestamp is stale, to keep polling cheap.
  if (Date.now() - p.lastSeen > 10_000) {
    p.lastSeen = Date.now();
    await getStore().hSet(participantsKey(code), pid, JSON.stringify(p));
  }
  return p;
}

export async function removeParticipant(code: string, pid: string): Promise<void> {
  await getStore().hDel(participantsKey(code), pid);
}

export async function loadParticipants(code: string): Promise<Participant[]> {
  const all = await getStore().hGetAll(participantsKey(code));
  return Object.values(all)
    .map((raw) => JSON.parse(raw) as Participant)
    .sort((a, b) => a.joinedAt - b.joinedAt);
}

export async function clearResponses(code: string, stage: 'stage1' | PlacementStage, cardIds?: string[]): Promise<void> {
  const store = getStore();
  const key = participantsKey(code);
  const all = await store.hGetAll(key);
  for (const [pid, raw] of Object.entries(all)) {
    const p = JSON.parse(raw) as Participant;
    if (stage === 'stage1') {
      p.stage1 = null;
    } else if (cardIds) {
      for (const id of cardIds) delete p[stage][id];
    } else {
      p[stage] = {};
    }
    p.updatedAt = Date.now();
    await store.hSet(key, pid, JSON.stringify(p));
  }
}

// ─── Validation helpers shared by the routes ────────────────────────

/** Stage 1 submission: `order` is a permutation of the visible stage
 *  cards minus the `out` pile; every card appears exactly once across
 *  the two lists. */
export function validateStage1(
  session: Session,
  order: unknown,
  out: unknown,
): { order: string[]; out: string[] } | null {
  if (!Array.isArray(order) || !Array.isArray(out)) return null;
  const visible = new Set(deckCards('stages', session.hideExplicit).map((c) => c.id));
  const seen = new Set<string>();
  for (const id of [...order, ...out]) {
    if (!isKnownCard(id) || !visible.has(id) || seen.has(id)) return null;
    seen.add(id);
  }
  if (seen.size !== visible.size) return null;
  return { order: order as string[], out: out as string[] };
}

/** Which column ids a participant may place a card in for a stage. */
export function allowedColumns(session: Session, stage: PlacementStage): Set<string> {
  const cols = new Set(session.timeline);
  if (stage === 'stage3') cols.add(NEVER_COLUMN_ID);
  return cols;
}

export function validatePlacement(
  session: Session,
  stage: PlacementStage,
  cardId: unknown,
  columnId: unknown,
): { cardId: string; columnId: string } | null {
  if (!isKnownCard(cardId) || typeof columnId !== 'string') return null;
  const deck: DeckId = stage === 'stage2' ? 'activities' : 'fluids';
  if (!deckCards(deck, session.hideExplicit).some((c) => c.id === cardId)) return null;
  if (!session[stage].open.includes(cardId)) return null;
  if (!allowedColumns(session, stage).has(columnId)) return null;
  return { cardId, columnId };
}

/** A timeline the host sets after Stage 1: distinct visible stage-card
 *  ids, at least two of them. Cards left out are simply "not on the
 *  timeline". */
export function validateTimeline(session: Session, raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length < 2) return null;
  const visible = new Set(deckCards('stages', session.hideExplicit).map((c) => c.id));
  const seen = new Set<string>();
  for (const id of raw) {
    if (!isKnownCard(id) || !visible.has(id) || seen.has(id)) return null;
    seen.add(id);
  }
  return raw as string[];
}

export { OUT_PILE_ID, NEVER_COLUMN_ID, STAGE_CARDS };
