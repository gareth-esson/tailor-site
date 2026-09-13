/**
 * Shared search helpers for the A4 header search and the B10 search page.
 *
 * Everything in here is DOM-free and dependency-free — the only side effect
 * is the single cached catalogue fetch — so `tests/search-reliability.test.mjs`
 * can exercise it under `node --test` with no browser and no new packages.
 * Keep it that way: no imports (Node's type stripping loads this file
 * directly), no `document`, no `window`.
 *
 * ## The catalogue
 *
 * `/search-titles.json` is generated after Pagefind by
 * `scripts/build-search-titles.mjs`, from the membership of the actual
 * finished index: one row per indexed page, `[id, url, title]`, sorted. It is
 * never hand-maintained and never contains a page Pagefind didn't index.
 *
 * It exists so both surfaces can rank, group and count *result references*
 * — the cheap `{ id, data() }` objects Pagefind returns — before spending a
 * `.data()` fetch on any of them. That is what makes an exact page-title
 * match reachable (the hub can be promoted from rank 50 into the header's
 * top 8 without hydrating 50 results) and what lets the full page hydrate
 * only the rows it actually shows.
 */

/** One indexed page: Pagefind result id, its canonical local URL, its title. */
export interface CatalogueEntry {
  id: string;
  url: string;
  title: string;
}

/** Parsed catalogue with the lookups both surfaces need. */
export interface SearchCatalogue {
  entries: CatalogueEntry[];
  /** Pagefind result id → entry. */
  byId: Map<string, CatalogueEntry>;
  /** `normalizeTitleKey(title)` → entries sharing that normalised title. */
  byTitle: Map<string, CatalogueEntry[]>;
}

/** Where the generated catalogue is served from. */
export const CATALOGUE_URL = '/search-titles.json';

/* -------------------------------------------------------------------------- */
/* Normalisation and URL safety                                               */
/* -------------------------------------------------------------------------- */

/** Smart single quotes, primes, backtick. */
const SINGLE_QUOTES = /[\u2018\u2019\u201a\u201b\u2032\u00b4\u0060]/g;
/** Smart double quotes, double prime. */
const DOUBLE_QUOTES = /[\u201c\u201d\u201e\u201f\u2033]/g;
/** Hyphen/dash family plus the minus sign. */
const DASHES = /[\u2010-\u2015\u2212]/g;
/** Non-breaking, en/em, thin, figure, narrow and ideographic spaces. */
const EXOTIC_SPACES = /[\u00a0\u2000-\u200a\u2007\u202f\u205f\u3000]/g;
/** Zero-width characters, word joiner, BOM, soft hyphen. */
const INVISIBLES = /[\u200b\u200c\u200d\u2060\ufeff\u00ad]/g;
/** C0/C1-adjacent control characters and DEL. */
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/;

/**
 * Fold a query or a title down to the key used for exact-title equality:
 * NFKC, curly punctuation → ASCII, exotic spaces → plain spaces, zero-width
 * characters dropped, whitespace collapsed, trimmed, lowercased.
 *
 * "Exact" here means exact *after* this folding — `  For Schools ` and
 * `For schools` match; `schools` and `For schools` do not.
 */
export function normalizeTitleKey(value: string): string {
  return value
    .normalize('NFKC')
    .replace(SINGLE_QUOTES, "'")
    .replace(DOUBLE_QUOTES, '"')
    .replace(DASHES, '-')
    .replace(/\u2026/g, '...')
    .replace(EXOTIC_SPACES, ' ')
    .replace(INVISIBLES, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * True only for a canonical same-origin path: starts with a single `/`, no
 * scheme, no `//host`, no backslash tricks, no control characters. Pagefind
 * URLs from a `--site` build are always of this shape; anything else is
 * rejected rather than rendered as an href.
 */
export function isSafeLocalUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value.length === 0 || value.length > 2048) return false;
  if (value.charCodeAt(0) !== 47 /* '/' */) return false;
  if (value.charCodeAt(1) === 47 /* '//' is protocol-relative */) return false;
  if (value.includes('\\')) return false;
  if (CONTROL_CHARS.test(value)) return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/* Catalogue parsing and loading                                              */
/* -------------------------------------------------------------------------- */

/**
 * Validate and index a catalogue document. Rows are `[id, url, title]`;
 * malformed rows, non-local URLs and duplicate ids are dropped rather than
 * trusted. Returns `null` when the payload yields nothing usable, which
 * callers treat as "no catalogue" and degrade accordingly.
 */
export function parseCatalogue(payload: unknown): SearchCatalogue | null {
  if (!payload || typeof payload !== 'object') return null;
  const rows = (payload as { entries?: unknown }).entries;
  if (!Array.isArray(rows)) return null;

  const entries: CatalogueEntry[] = [];
  const byId = new Map<string, CatalogueEntry>();
  const byTitle = new Map<string, CatalogueEntry[]>();

  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 3) continue;
    const [id, url, title] = row as unknown[];
    if (typeof id !== 'string' || id.length === 0) continue;
    if (typeof title !== 'string') continue;
    if (!isSafeLocalUrl(url)) continue;
    if (byId.has(id)) continue;

    const entry: CatalogueEntry = { id, url, title };
    entries.push(entry);
    byId.set(id, entry);

    const key = normalizeTitleKey(title);
    if (!key) continue;
    const bucket = byTitle.get(key);
    if (bucket) bucket.push(entry);
    else byTitle.set(key, [entry]);
  }

  if (entries.length === 0) return null;
  return { entries, byId, byTitle };
}

let cataloguePromise: Promise<SearchCatalogue | null> | null = null;

/**
 * Fetch and parse the catalogue at most once per page. Every failure mode —
 * missing file, HTTP error, bad JSON, rejected fetch — resolves to `null`
 * instead of rejecting, so no caller can produce an unhandled rejection or a
 * false "no results".
 */
export function loadCatalogue(fetchImpl?: typeof fetch): Promise<SearchCatalogue | null> {
  if (!cataloguePromise) {
    cataloguePromise = readCatalogue(fetchImpl).catch(() => null);
  }
  return cataloguePromise;
}

/** Drop the cached catalogue promise. Exported for tests. */
export function resetCatalogueCache(): void {
  cataloguePromise = null;
}

async function readCatalogue(fetchImpl?: typeof fetch): Promise<SearchCatalogue | null> {
  const request = fetchImpl ?? (typeof fetch === 'function' ? fetch : null);
  if (!request) return null;
  const response = await request(CATALOGUE_URL, { credentials: 'omit' });
  if (!response || !response.ok) return null;
  return parseCatalogue(await response.json());
}

/* -------------------------------------------------------------------------- */
/* Pagefind shapes and loading                                                */
/* -------------------------------------------------------------------------- */

export interface PagefindResultData {
  url?: unknown;
  excerpt?: unknown;
  meta?: { title?: unknown } | null;
}

/** The cheap reference Pagefind returns before any data is fetched. */
export interface PagefindResultRef {
  id?: unknown;
  data(): Promise<PagefindResultData>;
}

export interface PagefindResponse {
  results: PagefindResultRef[];
}

export interface PagefindModule {
  search(query: string): Promise<PagefindResponse>;
  init?(): Promise<void>;
}

/**
 * Import the Pagefind client from the generated index.
 *
 * Pagefind is produced *after* the Astro build, so the bundler must not try
 * to resolve this specifier at build time — hence the Function constructor,
 * the same approach the search page has always used. Rejects if the index
 * isn't there (dev server, failed deploy); callers catch and degrade.
 */
export function loadPagefindModule(): Promise<PagefindModule> {
  const loader = new Function(
    'return import("/pagefind/pagefind.js")',
  ) as () => Promise<PagefindModule>;
  return loader();
}

/** The result id, or `null` when Pagefind gave us something unexpected. */
export function refId(ref: unknown): string | null {
  if (!ref || typeof ref !== 'object') return null;
  const id = (ref as { id?: unknown }).id;
  return typeof id === 'string' && id.length > 0 ? id : null;
}

/**
 * Hydrate result references, tolerating individual failures.
 *
 * Returns the pairs that resolved, in request order. Rejections are absorbed
 * here so a single bad fragment fetch can't blank a page or surface as an
 * unhandled rejection; callers compare the returned length against what they
 * asked for to decide whether to show the unavailable surface.
 */
export async function hydrateRefs<T extends PagefindResultRef>(
  refs: readonly T[],
): Promise<Array<{ ref: T; data: PagefindResultData }>> {
  const settled = await Promise.allSettled(refs.map((ref) => ref.data()));
  const hydrated: Array<{ ref: T; data: PagefindResultData }> = [];
  settled.forEach((outcome, index) => {
    if (outcome.status !== 'fulfilled') return;
    const data = outcome.value;
    if (!data || typeof data !== 'object') return;
    hydrated.push({ ref: refs[index]!, data });
  });
  return hydrated;
}

/* -------------------------------------------------------------------------- */
/* Exact-title ranking                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Ids of catalogue entries whose title is exactly the query after
 * normalisation. Empty when there is no catalogue or no exact match — this
 * never invents a page, it only names ones already in the index.
 */
export function exactTitleIds(query: string, catalogue: SearchCatalogue | null): Set<string> {
  const ids = new Set<string>();
  if (!catalogue) return ids;
  const key = normalizeTitleKey(query);
  if (!key) return ids;
  const matches = catalogue.byTitle.get(key);
  if (!matches) return ids;
  for (const entry of matches) ids.add(entry.id);
  return ids;
}

/**
 * Header ranking: move any result whose page title exactly equals the query
 * to the front, keep Pagefind's order for everything else, drop duplicate
 * ids and duplicate URLs, then cut to `limit`.
 *
 * Only members of this result set move — nothing is added. The returned list
 * is exactly what the caller will hydrate, so the header's "at most `limit`
 * data loads per settled query" budget is structural.
 */
export function planHeaderRefs<T extends object>(
  refs: readonly T[],
  query: string,
  catalogue: SearchCatalogue | null,
  limit: number,
): T[] {
  const exact = exactTitleIds(query, catalogue);
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const promoted: T[] = [];
  const rest: T[] = [];

  for (const ref of refs) {
    const id = refId(ref);
    if (id) {
      if (seenIds.has(id)) continue;
      seenIds.add(id);
    }
    const entry = id && catalogue ? catalogue.byId.get(id) : undefined;
    if (entry) {
      if (seenUrls.has(entry.url)) continue;
      seenUrls.add(entry.url);
    }
    if (id && exact.has(id)) promoted.push(ref);
    else rest.push(ref);
  }

  const ordered = promoted.concat(rest);
  return limit >= 0 ? ordered.slice(0, limit) : ordered;
}

/* -------------------------------------------------------------------------- */
/* Full-page grouping                                                         */
/* -------------------------------------------------------------------------- */

export interface PlannedGroup<T> {
  type: string;
  /** Every reference in this group, in display order. */
  refs: T[];
  /** `refs.length` — the count the heading and "Show all" button promise. */
  total: number;
  /** How many leading refs are exact-title matches. */
  exactCount: number;
}

export type FullSearchPlan<T> =
  | { ok: true; total: number; groups: Array<PlannedGroup<T>> }
  | { ok: false; reason: 'no-catalogue' | 'no-result-ids' | 'incomplete-catalogue' };

/**
 * Group, order and count a whole result set from the catalogue alone — no
 * `.data()` calls. The caller then hydrates only the rows it shows.
 *
 * Ordering: the group holding the first exact-title match comes first (with
 * the exact matches at the top of it, so an exact hit is never buried at the
 * bottom of "Other"); every other group keeps the existing `typeOrder`.
 * Labels and type keys are untouched.
 *
 * Refuses to plan — rather than quietly hydrating everything — when the
 * catalogue is missing, when Pagefind gave no usable ids, or when the
 * catalogue doesn't cover the result set (a stale catalogue against a newer
 * index). Callers show their existing unavailable surface in that case.
 */
export function planFullSearch<T extends object>(
  refs: readonly T[],
  query: string,
  catalogue: SearchCatalogue | null,
  options: { getType(url: string): string; typeOrder: readonly string[] },
): FullSearchPlan<T> {
  if (!catalogue) return { ok: false, reason: 'no-catalogue' };

  const exact = exactTitleIds(query, catalogue);
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const exactRefs = new Map<string, T[]>();
  const otherRefs = new Map<string, T[]>();
  const appearance: string[] = [];
  const exactTypes: string[] = [];
  let total = 0;

  for (const ref of refs) {
    const id = refId(ref);
    if (!id) return { ok: false, reason: 'no-result-ids' };
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const entry = catalogue.byId.get(id);
    if (!entry) return { ok: false, reason: 'incomplete-catalogue' };
    if (seenUrls.has(entry.url)) continue;
    seenUrls.add(entry.url);

    const type = options.getType(entry.url);
    if (!appearance.includes(type)) appearance.push(type);
    const isExact = exact.has(id);
    const bucket = isExact ? exactRefs : otherRefs;
    const list = bucket.get(type);
    if (list) list.push(ref);
    else bucket.set(type, [ref]);
    if (isExact && !exactTypes.includes(type)) exactTypes.push(type);
    total += 1;
  }

  const ordered: string[] = [];
  for (const type of exactTypes) ordered.push(type);
  for (const type of options.typeOrder) {
    if (!ordered.includes(type)) ordered.push(type);
  }
  for (const type of appearance) {
    if (!ordered.includes(type)) ordered.push(type);
  }

  const groups: Array<PlannedGroup<T>> = [];
  for (const type of ordered) {
    const head = exactRefs.get(type) ?? [];
    const tail = otherRefs.get(type) ?? [];
    if (head.length === 0 && tail.length === 0) continue;
    const groupRefs = head.concat(tail);
    groups.push({ type, refs: groupRefs, total: groupRefs.length, exactCount: head.length });
  }

  return { ok: true, total, groups };
}

/* -------------------------------------------------------------------------- */
/* Row field selection                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Pick the href for a row: the hydrated Pagefind URL when it is a canonical
 * local path, otherwise the catalogue's (generator-validated) URL, otherwise
 * `null` — the caller then renders the title as plain text rather than an
 * unsafe link.
 */
export function pickRowUrl(dataUrl: unknown, fallbackUrl?: string | null): string | null {
  if (isSafeLocalUrl(dataUrl)) return dataUrl;
  if (isSafeLocalUrl(fallbackUrl)) return fallbackUrl;
  return null;
}

/**
 * Pick the row title, preserving the existing "title, else URL" behaviour.
 * Metadata is raw author content, so callers must set it as text.
 */
export function pickRowTitle(
  dataTitle: unknown,
  fallbackTitle?: string | null,
  url?: string | null,
): string {
  if (typeof dataTitle === 'string' && dataTitle.trim().length > 0) return dataTitle;
  if (typeof fallbackTitle === 'string' && fallbackTitle.trim().length > 0) return fallbackTitle;
  return typeof url === 'string' ? url : '';
}

/* -------------------------------------------------------------------------- */
/* Excerpt rendering                                                          */
/* -------------------------------------------------------------------------- */

export interface ExcerptSegment {
  text: string;
  mark: boolean;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body.charCodeAt(0) === 35 /* '#' */) {
      const hex = body.charCodeAt(1) === 120 || body.charCodeAt(1) === 88;
      const code = Number.parseInt(hex ? body.slice(2) : body.slice(1), hex ? 16 : 10);
      if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return match;
      if (code >= 0xd800 && code <= 0xdfff) return match;
      return String.fromCodePoint(code);
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named === undefined ? match : named;
  });
}

/**
 * Split a Pagefind excerpt into text/highlight segments.
 *
 * Pagefind escapes the page text and then wraps matches in `<mark>`, so the
 * only markup we honour is `<mark>`; everything else stays literal text.
 * Callers build text nodes and `<mark>` elements from these segments, which
 * keeps the highlighting while removing HTML parsing from the render path
 * entirely — no excerpt, title or URL can inject an element, an event
 * attribute or a script.
 */
export function splitExcerpt(excerpt: unknown): ExcerptSegment[] {
  if (typeof excerpt !== 'string' || excerpt.length === 0) return [];
  const segments: ExcerptSegment[] = [];
  const pattern = /<\/?mark\s*>/gi;
  let cursor = 0;
  let depth = 0;
  let match: RegExpExecArray | null;

  const push = (raw: string, mark: boolean): void => {
    if (!raw) return;
    const text = decodeEntities(raw);
    if (!text) return;
    const last = segments[segments.length - 1];
    if (last && last.mark === mark) last.text += text;
    else segments.push({ text, mark });
  };

  while ((match = pattern.exec(excerpt)) !== null) {
    push(excerpt.slice(cursor, match.index), depth > 0);
    if (match[0].charCodeAt(1) === 47 /* '/' */) depth = Math.max(0, depth - 1);
    else depth += 1;
    cursor = match.index + match[0].length;
  }
  push(excerpt.slice(cursor), depth > 0);
  return segments;
}

/* -------------------------------------------------------------------------- */
/* Stale-response protection                                                  */
/* -------------------------------------------------------------------------- */

export interface RequestGate {
  /** Invalidate everything in flight and take a token for a new request. */
  next(): number;
  /** The current generation. */
  current(): number;
  /** True once a newer request has been started. */
  isStale(token: number): boolean;
}

/**
 * Monotonic generation counter.
 *
 * Both surfaces bump it the moment the user changes anything (keystroke,
 * clear, Escape, close, outside click) — not after the debounce — and check
 * `isStale` after every `await` and before every render, URL/title update or
 * analytics call. An out-of-order Pagefind response can then only be
 * discarded, never painted.
 */
export function createRequestGate(): RequestGate {
  let generation = 0;
  return {
    next: () => ++generation,
    current: () => generation,
    isStale: (token: number) => token !== generation,
  };
}
