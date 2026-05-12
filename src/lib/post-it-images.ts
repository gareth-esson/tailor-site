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
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const slugToExt = slugMapRaw as Record<string, string>;

const PUBLIC_POSTITS_DIR = path.resolve(
  process.cwd(),
  'public/images/post-it-scans',
);

export interface PostItImage {
  /** WebP path — the <img> src fallback. */
  path: string;
  /**
   * AVIF sibling path if `optimize-post-it-images.mjs` has been run.
   * Null when the .avif file isn't on disk (rare; degrades gracefully
   * to webp-only `<picture>`).
   */
  avifPath: string | null;
  width: number;
  height: number;
}

/**
 * Get the public URL path for a question's post-it scan image.
 * Returns null if no image exists for this slug.
 */
export function getPostItImagePath(slug: string): string | null {
  const ext = slugToExt[slug];
  if (!ext) return null;
  return `/images/post-it-scans/${slug}${ext}`;
}

/**
 * Get the post-it scan path AND its intrinsic pixel dimensions, read
 * from disk via sharp at build time. Dimensions matter for two reasons:
 *
 *   1. The post-it is the LCP element on a question page; declaring
 *      width/height on the <img> prevents layout shift (CLS).
 *   2. Social platforms (LinkedIn, Slack) prefer og:image:width/height
 *      meta declared up front so they don't need to fetch the image
 *      to compute its preview card size.
 *
 * Post-it scans vary in dimensions (~880×900 to ~1730×1280), so a
 * hardcoded constant in the template would be wrong for most of them.
 *
 * Returns null if no scan exists for this slug, or if dimensions can't
 * be read (which falls back to the template omitting the figure).
 */
export async function getPostItImage(slug: string): Promise<PostItImage | null> {
  const ext = slugToExt[slug];
  if (!ext) return null;
  const url = `/images/post-it-scans/${slug}${ext}`;
  try {
    const fullPath = path.join(PUBLIC_POSTITS_DIR, `${slug}${ext}`);
    const meta = await sharp(fullPath).metadata();
    if (meta.width && meta.height) {
      const avifFsPath = fullPath.replace(/\.webp$/, '.avif');
      const avifPath = ext === '.webp' && fs.existsSync(avifFsPath)
        ? url.replace(/\.webp$/, '.avif')
        : null;
      return { path: url, avifPath, width: meta.width, height: meta.height };
    }
  } catch {
    // file missing or unreadable — fall through
  }
  return null;
}
