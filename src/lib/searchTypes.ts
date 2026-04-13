/**
 * Shared search-type taxonomy for Pagefind-powered site search.
 *
 * Source of truth for:
 *   - `src/scripts/search-page.ts` (B10 search results page, module script)
 *   - `src/components/SearchBar.astro` (A4 header search, `<script is:inline>`
 *     — must duplicate the literals below verbatim because inline scripts
 *     cannot import modules; a cross-reference comment in that file points
 *     back here)
 *
 * If you change a label, a type key, or a URL-matching rule here, mirror
 * the change in SearchBar.astro in the same commit.
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
 * Display order for grouped results. Most-likely-intent first; services
 * last so a generic query doesn't get dominated by service-page matches.
 */
export const typeOrder: ContentType[] = [
  'anonymous_question',
  'glossary',
  'topics',
  'blog',
  'services',
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
