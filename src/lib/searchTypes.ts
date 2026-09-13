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
  | 'glossary'
  | 'topics'
  | 'blog'
  | 'services'
  | 'other';

/**
 * Display label per content type. "Okay to Ask" is the brand name for
 * anonymous questions; use it on every surface that names the type.
 */
export const typeLabels: Record<ContentType, string> = {
  anonymous_question: 'Okay to Ask',
  glossary: 'Glossary',
  topics: 'Topics',
  blog: 'Blog',
  services: 'Services',
  other: 'Other',
};

/**
 * Display order for grouped results. Service-first ordering: a buyer
 * lands here looking to commission, not to browse — services lead.
 */
export const typeOrder: ContentType[] = [
  'services',
  'blog',
  'topics',
  'anonymous_question',
  'glossary',
  'other',
];

/** Map a result URL to its content type. */
export function getContentType(url: string): ContentType {
  if (url.includes('/anonymous_question/')) return 'anonymous_question';
  if (url.includes('/glossary/')) return 'glossary';
  if (url.includes('/topics/')) return 'topics';
  if (url.includes('/blog/')) return 'blog';
  if (url.includes('/services/') || url.includes('/training')) {
    return 'services';
  }
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
  'blog',
  'topics',
]);

export function isSearchableType(t: ContentType): boolean {
  return SEARCHABLE_TYPES.has(t);
}

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
