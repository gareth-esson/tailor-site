#!/usr/bin/env node
/**
 * Generate AVIF siblings for every post-it scan WebP.
 *
 * Post-it scans display at a constrained max-width on question pages
 * (~22rem desktop, smaller on mobile) so a single non-responsive AVIF
 * variant at source dimensions is fine — no -800 / -1600 split.
 *
 * Output: for `slug.webp` we write `slug.avif` in the same directory.
 * The PostItImage helper picks up the AVIF automatically via fs check.
 *
 * Idempotent — skips variants already up to date.
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'public/images/post-it-scans';
const AVIF_QUALITY = 55;

const webps = fs.readdirSync(DIR)
  .filter((f) => f.endsWith('.webp'))
  .map((f) => path.join(DIR, f));

console.log(`Generating AVIF siblings for ${webps.length} post-it WebPs…`);

let generated = 0;
let skipped = 0;
let totalWebpBytes = 0;
let totalAvifBytes = 0;

for (const src of webps) {
  const out = src.replace(/\.webp$/, '.avif');
  const srcStat = fs.statSync(src);
  totalWebpBytes += srcStat.size;

  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= srcStat.mtimeMs) {
    skipped += 1;
    totalAvifBytes += fs.statSync(out).size;
    continue;
  }

  try {
    await sharp(src).avif({ quality: AVIF_QUALITY }).toFile(out);
    const outStat = fs.statSync(out);
    totalAvifBytes += outStat.size;
    generated += 1;
  } catch (err) {
    console.error(`  ✗ ${path.basename(src)}: ${err.message}`);
  }
}

const webpMB = (totalWebpBytes / 1024 / 1024).toFixed(1);
const avifMB = (totalAvifBytes / 1024 / 1024).toFixed(1);
const reduction = (100 * (1 - totalAvifBytes / totalWebpBytes)).toFixed(0);

console.log(`\nDone. ${generated} generated, ${skipped} up-to-date.`);
console.log(`Total WebP: ${webpMB} MB  →  Total AVIF: ${avifMB} MB  (-${reduction}%)`);
