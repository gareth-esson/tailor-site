/**
 * Hero image helpers.
 *
 * The repo convention: for every WebP under public/images that's a hero
 * (i.e. above-the-fold + LCP-relevant), the optimize-hero-images.mjs
 * script generates sibling variants alongside the original:
 *
 *   foo.webp           ← original (typically 1600w, used as 1600w WebP slot)
 *   foo-800.webp       ← 800w WebP (smaller variant for tablets)
 *   foo-800.avif       ← 800w AVIF
 *   foo-1600.avif      ← 1600w AVIF (skipped for source images <1600w)
 *
 * These helpers turn a single source path into:
 *   - srcset strings (AVIF + WebP) for <picture><source>
 *   - preload props for BaseLayout
 *
 * If you add a new hero image: drop the WebP into public/images, add
 * its path to HERO_IMAGES in scripts/optimize-hero-images.mjs, run the
 * script, and use this helper at the call site.
 */

export interface HeroVariants {
  /** Original WebP path — the <img> src fallback. */
  src: string;
  /** AVIF srcset for the <source type="image/avif"> tag. */
  srcsetAvif: string;
  /** WebP srcset for the <source type="image/webp"> tag. */
  srcsetWebp: string;
}

/**
 * Derive variant paths from an original WebP source.
 *
 * @param src - Original WebP path, e.g. "/images/services/foo.webp"
 * @param has1600Avif - Whether a -1600.avif variant exists. Defaults
 *   true; pass false if the source is narrower than 1600px.
 */
export function heroVariants(src: string, has1600Avif = true): HeroVariants {
  if (!src.endsWith('.webp')) {
    throw new Error(`heroVariants expects a .webp source, got: ${src}`);
  }
  const base = src.slice(0, -'.webp'.length);
  const avif800 = `${base}-800.avif`;
  const avif1600 = `${base}-1600.avif`;
  const webp800 = `${base}-800.webp`;

  const srcsetAvif = has1600Avif
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
 * @param opts.has1600Avif - See heroVariants
 */
export function heroPreload(
  src: string,
  opts: {
    sizes?: string;
    media?: string;
    has1600Avif?: boolean;
  } = {},
): HeroPreloadProps {
  const {
    sizes = '(min-width: 1024px) 50vw, 100vw',
    media,
    has1600Avif = true,
  } = opts;
  const variants = heroVariants(src, has1600Avif);

  const props: HeroPreloadProps = {
    // Fallback href (browsers without imagesrcset support pick this).
    preloadImage: variants.srcsetAvif.split(' ')[0],
    preloadImageSrcset: variants.srcsetAvif,
    preloadImageSizes: sizes,
  };
  if (media) props.preloadImageMedia = media;
  return props;
}
