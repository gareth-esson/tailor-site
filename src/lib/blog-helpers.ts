/**
 * Blog helpers — shared utilities for B9 (blog index) and C4 (blog post detail).
 * See Tailor_Layout_Spec_B9.md §3 for usage.
 *
 * Excerpt derivation moved into getBlogPosts() in src/lib/content.ts as
 * part of the Notion → MDX migration. Consumers read post.excerpt
 * directly now.
 */
import type { BlogPost } from './types';

/**
 * Format an ISO date string as British short form — e.g. "9 Apr 2026".
 * Matches the C4 blog post detail format exactly.
 * Returns null for null input so callers can `&&`-guard the output.
 */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Sort blog posts for the index page.
 *
 * Primary sort: publishedDate descending (newest first).
 * Tiebreak: alphabetical by title.
 * Null dates sink to the bottom of the list.
 *
 * If no post in the archive has a publishedDate populated at all, the sort
 * degrades to alphabetical-by-title and a warning is logged to the build
 * output so the content team has a nudge to populate dates.
 */
export function sortPostsForIndex(posts: BlogPost[]): BlogPost[] {
  const anyDated = posts.some((p) => p.publishedDate);
  if (!anyDated) {
    // eslint-disable-next-line no-console
    console.warn(
      '[blog] No posts have publishedDate populated — falling back to alphabetical sort. ' +
      'Populate publishedDate in Notion to restore newest-first ordering.',
    );
    return [...posts].sort((a, b) => a.title.localeCompare(b.title));
  }

  return [...posts].sort((a, b) => {
    if (!a.publishedDate && !b.publishedDate) return a.title.localeCompare(b.title);
    if (!a.publishedDate) return 1;
    if (!b.publishedDate) return -1;
    const cmp = b.publishedDate.localeCompare(a.publishedDate);
    if (cmp !== 0) return cmp;
    return a.title.localeCompare(b.title);
  });
}
