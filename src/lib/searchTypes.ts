/**
 * Shared search-type taxonomy for Pagefind-powered site search.
 *
 * Single source of truth — both surfaces import it:
 *   - `src/scripts/search-page.ts` (B10 search results page)
 *   - `src/scripts/search-header.ts` (A4 header search)
 *
 * SearchBar.astro used to carry a hand-kept copy of the literals below,
 * because its `<script is:inline>` block couldn't import modules. That script
 * is now a bundled module, so the duplicate is gone and a change here reaches
 * both surfaces on its own.
 */

export type ContentType =
  | 'anonymous_question'
  | 'pillar'
  | 'glossary'
  | 'topics'
  | 'blog'
  | 'services'
  | 'resources'
  | 'other';

/**
 * Display label per content type. "Okay to Ask" is the brand name for
 * anonymous questions; use it on every surface that names the type.
 */
export const typeLabels: Record<ContentType, string> = {
  anonymous_question: 'Okay to Ask',
  pillar: 'Bigger questions',
  glossary: 'Glossary',
  topics: 'Topics',
  blog: 'Blog',
  services: 'Services',
  resources: 'Free resources',
  other: 'Other',
};

/**
 * Display order for grouped results. Service-first ordering: a buyer
 * lands here looking to commission, not to browse — services lead.
 *
 * Free resources sit second: the quiz and the audit sheet are the things a
 * PSHE lead can take away without talking to anyone, so they convert a
 * browser into a return visit more readily than a post does. Position is a
 * judgement call, not a constraint — move it if the analytics disagree.
 */
export const typeOrder: ContentType[] = [
  'services',
  'resources',
  'blog',
  'topics',
  'anonymous_question',
  'pillar',
  'glossary',
  'other',
];

/** Map a result URL to its content type. */
export function getContentType(url: string): ContentType {
  if (url.includes('/anonymous_question/')) return 'anonymous_question';
  if (url.includes('/explained/')) return 'pillar';
  if (url.includes('/glossary/')) return 'glossary';
  if (url.includes('/topics/')) return 'topics';
  if (url.includes('/blog/')) return 'blog';
  if (url.includes('/services/') || url.includes('/training')) {
    return 'services';
  }
  if (url.includes('/resources/')) return 'resources';
  return 'other';
}

/**
 * Search scope: which content types appear in chrome / B10 search results.
 * OtA content (anonymous_question, glossary) is excluded — those surfaces
 * have their own browse and may get a dedicated OtA-internal search later.
 *
 * Both surfaces apply this through the planners in `search-client.ts`, which
 * scope result references against catalogue URLs before hydrating any of
 * them. Nothing mirrors these literals any more — change them here only.
 */
const SEARCHABLE_TYPES: ReadonlySet<ContentType> = new Set([
  'services',
  'resources',
  'blog',
  'topics',
]);

export function isSearchableType(t: ContentType): boolean {
  return SEARCHABLE_TYPES.has(t);
}

/**
 * OtA search scope: which content types appear on the Okay to Ask search
 * surface (`/questions/search`). The exact complement of the young-person
 * side of the site — questions, the pillar hubs that consolidate question
 * clusters, and the glossary.
 *
 * Deliberately disjoint from SEARCHABLE_TYPES: no type appears in both. A
 * reader is either looking for a service (chrome / B10) or for an answer
 * (here), and the two surfaces never return each other's content.
 */
const OTA_SEARCHABLE_TYPES: ReadonlySet<ContentType> = new Set([
  'anonymous_question',
  'pillar',
  'glossary',
]);

export function isOtaSearchableType(t: ContentType): boolean {
  return OTA_SEARCHABLE_TYPES.has(t);
}

/**
 * Display order for OtA results. A young person types their actual question,
 * so the real handed-in questions lead; the pillar hubs follow as the
 * broader "bigger question" behind a cluster; the glossary last, since a
 * term definition answers a narrower need than a question does.
 */
export const otaTypeOrder: ContentType[] = [
  'anonymous_question',
  'pillar',
  'glossary',
];

/**
 * Strict substring match — drops Pagefind fuzzy/prefix false-positives like
 * "xyzzzz" matching the chromosome glossary "XY". Every whitespace-separated
 * token in the query must appear in the result title or excerpt.
 *
 * NOT WIRED UP. Neither surface calls this. It is a candidate fix for fuzzy
 * false positives, held back because a strict substring test also drops
 * legitimate stemmed hits — "consent lessons" would reject a page titled
 * "Consent lesson". Its original motivating example (a glossary entry) is
 * moot now that OtA content is out of scope. Decide it on its own merits
 * before calling it; don't assume this filter is active today.
 */
export function queryMatchesResult(
  query: string,
  result: { meta?: { title?: string }; excerpt?: string },
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const title = (result.meta?.title ?? '').toLowerCase();
  // Strip Pagefind <mark> wrappers from the excerpt before substring testing.
  const excerpt = (result.excerpt ?? '').replace(/<[^>]*>/g, '').toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((t) => title.includes(t) || excerpt.includes(t));
}
