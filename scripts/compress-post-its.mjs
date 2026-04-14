#!/usr/bin/env node
/**
 * One-off: convert all post-it JPEG scans to WebP and update slug-map.json.
 *
 * Why: the original JPEGs are 500KB–1.2MB each, totalling ~60MB. Landing
 * pages show up to 6 at once. At WebP 82% quality the same visual result
 * weighs ~50–90KB per file — roughly a 10× reduction.
 *
 * Behaviour:
 *   - Converts every .jpeg/.jpg in public/images/post-it-scans/ to .webp.
 *   - Rewrites slug-map.json so existing lookups keep working.
 *   - Deletes the original JPEG once WebP is written.
 *   - Idempotent: re-running on a directory of WebPs does nothing.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCAN_DIR = path.resolve(__dirname, '../public/images/post-it-scans');
const MAP_PATH = path.join(SCAN_DIR, 'slug-map.json');
const WEBP_QUALITY = 82;

async function main() {
  const mapRaw = await fs.readFile(MAP_PATH, 'utf8');
  const map = JSON.parse(mapRaw);

  const entries = Object.entries(map);
  const jpegEntries = entries.filter(
    ([, ext]) => ext === '.jpeg' || ext === '.jpg',
  );

  if (jpegEntries.length === 0) {
    console.log('No JPEGs to convert. Nothing to do.');
    return;
  }

  console.log(`Converting ${jpegEntries.length} JPEG → WebP at q${WEBP_QUALITY}...`);
  let totalBefore = 0;
  let totalAfter = 0;
  let failures = 0;

  for (const [slug, ext] of jpegEntries) {
    const src = path.join(SCAN_DIR, `${slug}${ext}`);
    const dest = path.join(SCAN_DIR, `${slug}.webp`);
    try {
      const srcStat = await fs.stat(src);
      totalBefore += srcStat.size;

      await sharp(src).webp({ quality: WEBP_QUALITY }).toFile(dest);
      const destStat = await fs.stat(dest);
      totalAfter += destStat.size;

      await fs.unlink(src);
      map[slug] = '.webp';

      const pct = ((1 - destStat.size / srcStat.size) * 100).toFixed(0);
      console.log(`  ${slug}: ${(srcStat.size / 1024).toFixed(0)}KB → ${(destStat.size / 1024).toFixed(0)}KB (−${pct}%)`);
    } catch (err) {
      console.error(`  FAIL ${slug}: ${err.message}`);
      failures++;
    }
  }

  await fs.writeFile(MAP_PATH, JSON.stringify(map, null, 2) + '\n');

  console.log('');
  console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Total after:  ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Saved:        ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
  if (failures > 0) {
    console.log(`Failures:     ${failures} — check stderr above`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
