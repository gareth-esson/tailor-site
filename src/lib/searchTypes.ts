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
