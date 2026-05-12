/**
 * Build-time cache for blog featured images sourced from Notion.
 *
 * Notion serves uploaded files via signed S3 URLs that expire after ~1 h.
 * Hot-linking them at runtime is fragile (URLs go stale) and slow (the
 * CDN is not Vercel's edge), and we can't generate AVIF/WebP variants
 * of a remote file. This helper downloads each featured image to
 * `public/images/blog/{slug}.webp` at build time, generates the same
 * -800/-1600 sibling variants as static heroes, and returns the local
 * URL.
 *
 * Cache hits (the common case after first download) are zero-IO beyond
 * an fs.existsSync. Cache misses download once and write to disk; the
 * resulting files are committed to the repo so subsequent builds (and
 * Vercel production builds) are also cache hits.
 *
 * In-body images embedded in blog post markdown are still Notion-hosted
 * and not handled here.
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const BLOG_IMAGE_DIR = path.resolve(process.cwd(), 'public/images/blog');

function ensureDir(): void {
  if (!fs.existsSync(BLOG_IMAGE_DIR)) {
    fs.mkdirSync(BLOG_IMAGE_DIR, { recursive: true });
  }
}

function localWebpPath(slug: string): { fsPath: string; url: string } {
  return {
    fsPath: path.join(BLOG_IMAGE_DIR, `${slug}.webp`),
    url: `/images/blog/${slug}.webp`,
  };
}

async function generateVariants(slug: string): Promise<void> {
  const src = path.join(BLOG_IMAGE_DIR, `${slug}.webp`);
  const meta = await sharp(src).metadata();
  const srcW = meta.width ?? 0;

  const variants: Array<{ width: number; format: 'avif' | 'webp'; q: number }> = [
    { width: 800, format: 'avif', q: 60 },
    { width: 800, format: 'webp', q: 78 },
  ];
  if (srcW >= 1600) {
    variants.push({ width: 1600, format: 'avif', q: 55 });
  }

  for (const v of variants) {
    if (v.width > srcW) continue;
    const out = path.join(BLOG_IMAGE_DIR, `${slug}-${v.width}.${v.format}`);
    if (fs.existsSync(out)) continue;
    await sharp(src).resize({ width: v.width })[v.format]({ quality: v.q }).toFile(out);
  }
}

/**
 * Ensure a blog post's featured image is cached locally and return the
 * local /images/blog/{slug}.webp URL. On any failure (download, decode,
 * sharp error) returns null and the caller falls back to the Notion URL.
 */
export async function ensureBlogFeaturedImageCached(
  notionUrl: string,
  slug: string,
): Promise<string | null> {
  if (!slug) return null;
  ensureDir();

  const { fsPath, url } = localWebpPath(slug);

  // Cache hit: file exists. Ensure variants exist too (cheap when they do)
  // then return immediately.
  if (fs.existsSync(fsPath)) {
    try {
      await generateVariants(slug);
    } catch {
      // Variant generation failure isn't fatal; <picture> falls back to webp.
    }
    return url;
  }

  // Cache miss: download.
  try {
    const res = await fetch(notionUrl);
    if (!res.ok) {
      console.warn(`  ! blog image fetch ${res.status} for ${slug}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());

    // Convert whatever we got (jpg/png/webp/heic) into webp as the
    // canonical source. sharp picks the right decoder by content.
    await sharp(buf).webp({ quality: 82 }).toFile(fsPath);
    await generateVariants(slug);

    console.log(`  ↓ cached blog image: ${slug}`);
    return url;
  } catch (err) {
    console.warn(`  ! blog image cache failed for ${slug}:`, (err as Error).message);
    return null;
  }
}
