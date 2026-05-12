/**
 * Hero image helpers.
 *
 * The repo convention: for every WebP under public/images that's a hero
 * (i.e. above-the-fold + LCP-relevant), the optimize-hero-images.mjs
 * script generates sibling variants alongside the original:
 *
 *   foo.webp           ← original (typically 1600w; used as 1600w WebP slot)
 *   foo-800.webp       ← 800w WebP (smaller variant for tablets)
 *   foo-800.avif       ← 800w AVIF
 *   foo-1600.avif      ← 1600w AVIF (skipped for source images <1600w)
 *
 * These helpers turn a single source path into:
 *   - srcset strings (AVIF + WebP) for <picture><source>
 *   - preload props for BaseLayout
 *
 * Variant existence is detected at build time via fs.existsSync, so
 * pages don't need to know whether a -1600 sibling was generated.
 *
 * Adding a new hero image: drop the WebP in public/images, add its path
 * to HERO_IMAGES in scripts/optimize-hero-images.mjs, run the script,
 * and use the helper + <HeroImage> at the call site.
 */

import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

function publicFileExists(urlPath: string): boolean {
  // urlPath like "/images/services/foo-1600.avif" → public/images/services/foo-1600.avif
  const rel = urlPath.replace(/^\//, '');
  return fs.existsSync(path.join(PUBLIC_DIR, rel));
}

export interface HeroVariants {
  /** Original WebP path — the <img> src fallback. */
  src: string;
  /** AVIF srcset for the <source type="image/avif"> tag. */
  srcsetAvif: string;
  /** WebP srcset for the <source type="image/webp"> tag. */
  srcsetWebp: string;
}

/**
 * Derive variant paths from an original WebP source. Variants that
 * don't exist on disk (typically -1600.avif for sources <1600w) are
 * automatically omitted from the srcset.
 *
 * @param src - Original WebP path, e.g. "/images/services/foo.webp"
 */
export function heroVariants(src: string): HeroVariants {
  if (!src.endsWith('.webp')) {
    throw new Error(`heroVariants expects a .webp source, got: ${src}`);
  }
  const base = src.slice(0, -'.webp'.length);
  const avif800 = `${base}-800.avif`;
  const avif1600 = `${base}-1600.avif`;
  const webp800 = `${base}-800.webp`;

  const has1600 = publicFileExists(avif1600);
  const srcsetAvif = has1600
    ? `${avif800} 800w, ${avif1600} 1600w`
    : `${avif800} 800w`;
  const srcsetWebp = `${webp800} 800w, ${src} 1600w`;

  return { src, srcsetAvif, srcsetWebp };
}

export interface HeroPreloadProps {
  preloadImage: string;
  preloadImageSrcset: string;
  preloadImageSizes: string;
  preloadImageMedia?: string;
}

/**
 * Build BaseLayout preload props for a hero image.
 *
 * @param src - Original WebP path
 * @param opts.sizes - CSS sizes attr (defaults to the typical hero pattern)
 * @param opts.media - Optional media gate (e.g. "(min-width: 768px)" when
 *   the hero is hidden on mobile via `hidden md:block`)
 */
export function heroPreload(
  src: string,
  opts: {
    sizes?: string;
    media?: string;
  } = {},
): HeroPreloadProps {
  const {
    sizes = '(min-width: 1024px) 50vw, 100vw',
    media,
  } = opts;
  const variants = heroVariants(src);

  const props: HeroPreloadProps = {
    // Fallback href (browsers without imagesrcset support pick this).
    preloadImage: variants.srcsetAvif.split(' ')[0],
    preloadImageSrcset: variants.srcsetAvif,
    preloadImageSizes: sizes,
  };
  if (media) props.preloadImageMedia = media;
  return props;
}
