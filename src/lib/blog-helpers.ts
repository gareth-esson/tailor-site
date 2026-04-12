/**
 * Blog helpers — shared utilities for B9 (blog index) and C4 (blog post detail).
 * See Tailor_Layout_Spec_B9.md §3 for usage.
 */
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { BlogPost } from './types';

/**
 * Format an ISO date string as British long form — e.g. "11 April 2026".
 * Returns null for null input so callers can `&&`-guard the output.
 */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Walk a Notion body block array, find the first paragraph block with
 * meaningful text, and return its plain text content truncated to maxChars
 * at a word boundary (suffixed with an ellipsis if truncated).
 *
 * Returns null if no paragraph block is found or the first paragraph is
 * empty. Callers should `&&`-guard the output so the excerpt slot omits
 * gracefully.
 */
export function deriveExcerpt(
  body: BlockObjectResponse[] | null | undefined,
  maxChars: number,
): string | null {
  if (!body || body.length === 0) return null;

  // Find the first paragraph block with non-empty text. Skip empty paragraphs
  // (common in Notion exports) and non-paragraph blocks at the top of the
  // post (headings, images, callouts).
  for (const block of body) {
    if (block.type !== 'paragraph') continue;
    const richText = (block as Extract<BlockObjectResponse, { type: 'paragraph' }>).paragraph.rich_text;
    if (!richText || richText.length === 0) continue;

    const plain = richText.map((rt) => rt.plain_text ?? '').join('').trim();
    if (plain.length === 0) continue;

    if (plain.length <= maxChars) return plain;

    // Truncate at a word boundary at or before maxChars.
    const slice = plain.slice(0, maxChars);
    const lastSpace = slice.lastIndexOf(' ');
    const cut = lastSpace > maxChars * 0.6 ? slice.slice(0, lastSpace) : slice;
    return `${cut.trimEnd()}…`;
  }

  return null;
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
