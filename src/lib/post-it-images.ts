/**
 * Post-it image lookup.
 *
 * Files in public/images/post-it-scans/ are stored with slug-based names
 * (e.g. `are-you-a-slag-if-you-get-an-std.jpeg`). The original handwritten
 * filenames contained characters — notably `?` — that Vite's static server
 * will not serve from a URL path even when percent-encoded, so we rename
 * to slug on ingest and index the extensions in `slug-map.json`.
 *
 * If a question has no matching scan, this returns null and the template
 * omits the post-it figure entirely.
 */
import slugMapRaw from '../../public/images/post-it-scans/slug-map.json';

const slugToExt = slugMapRaw as Record<string, string>;

/**
 * Get the public URL path for a question's post-it scan image.
 * Returns null if no image exists for this slug.
 */
export function getPostItImagePath(slug: string): string | null {
  const ext = slugToExt[slug];
  if (!ext) return null;
  return `/images/post-it-scans/${slug}${ext}`;
}
