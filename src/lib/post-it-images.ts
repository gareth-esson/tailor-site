/**
 * Post-it image lookup.
 * The image-map.json maps original filenames → question slugs.
 * We invert it to get slug → filename for template use.
 */
import imageMapRaw from '../../images/post-it-scans/image-map.json';

// Invert the map: { filename: slug } → { slug: filename }
const slugToFilename: Record<string, string> = {};
for (const [filename, slug] of Object.entries(imageMapRaw)) {
  slugToFilename[slug as string] = filename;
}

/**
 * Get the public URL path for a question's post-it scan image.
 * Returns null if no image exists for this slug.
 */
export function getPostItImagePath(slug: string): string | null {
  const filename = slugToFilename[slug];
  if (!filename) return null;
  return `/images/post-it-scans/${encodeURIComponent(filename)}`;
}
