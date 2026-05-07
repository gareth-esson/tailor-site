/**
 * Build-time image-dimension resolver.
 *
 * Used for blog featured images coming from external URLs (Unsplash,
 * Notion-hosted files). Some social platforms (LinkedIn especially)
 * decline to render preview cards while waiting to fetch image bytes
 * to compute dimensions, so emitting og:image:width / og:image:height
 * up front improves share-preview reliability.
 *
 * `probe-image-size` reads only the first chunk of bytes (just enough
 * to parse the format header), so this is much cheaper than a full
 * download. We still keep an in-memory cache so the same URL doesn't
 * get probed twice in a single build.
 *
 * Failures are swallowed — a missing dimension is better than a
 * failed build.
 */
import probe from 'probe-image-size';

interface Dimensions {
  width: number;
  height: number;
}

const cache = new Map<string, Dimensions | null>();

/** Get pixel dimensions for an image URL. Returns null on any failure. */
export async function probeDimensions(url: string): Promise<Dimensions | null> {
  if (cache.has(url)) return cache.get(url) ?? null;
  try {
    const result = await probe(url);
    if (typeof result.width === 'number' && typeof result.height === 'number') {
      const dims = { width: result.width, height: result.height };
      cache.set(url, dims);
      return dims;
    }
  } catch {
    // Swallow — common cases: 404, expired Notion URL, no network in CI
    // sandbox. The blog post will simply omit og:image:width/height.
  }
  cache.set(url, null);
  return null;
}
