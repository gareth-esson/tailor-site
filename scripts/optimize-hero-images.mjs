#!/usr/bin/env node
/**
 * Generate AVIF + small-WebP variants for hero images.
 *
 * For every .webp listed in HERO_IMAGES, this writes alongside it:
 *   <name>-1600.avif   (or whatever the source width is, capped at 1600)
 *   <name>-800.avif
 *   <name>-800.webp
 *
 * The HeroImage.astro component picks the right one at runtime via
 * <picture> srcset.
 *
 * Run with `node scripts/optimize-hero-images.mjs` from the repo root.
 * Idempotent — skips variants that already exist and are newer than
 * the source.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const HERO_IMAGES = [
  // Homepage
  'public/images/services/tailor-education-secondary-rse-group-activity.webp',
  // Book page
  'public/images/ota-book-product-front.webp',
  // About page (leadership portraits)
  'public/images/portrait-gareth.webp',
  'public/images/portrait-sheila.webp',
  // Services hub + service pages
  'public/images/services/tailor-education-rse-consultant-school-corridor.webp',
  'public/images/services/tailor-education-rse-cpd-workshop-facilitator.webp',
  'public/images/services/tailor-education-primary-rse-circle-time.webp',
  'public/images/services/tailor-education-secondary-students-collaborative-learning.webp',
  'public/images/services/tailor-education-primary-pupil-rse-worksheet.webp',
  'public/images/services/tailor-education-special-school-friendships-boundaries-rse-lesson.webp',
  'public/images/services/tailor-education-teachers-planning-rse-curriculum.webp',
  'public/images/services/tailor-education-rse-year-group-session-school-hall.webp',
  // Below-fold homepage photos (still big, worth shrinking even at lazy)
  'public/images/services/tailor-education-primary-rse-discussion-circle.webp',
  'public/images/services/tailor-education-teachers-reviewing-rse-resources.webp',
];

const VARIANT_WIDTHS = [800, 1600];
const AVIF_Q = { 800: 60, 1600: 55 };
const WEBP_Q = { 800: 78 };  // 1600 webp = original (already optimised)

function fresherThan(out, src) {
  if (!fs.existsSync(out)) return false;
  return fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;
}

async function process(src) {
  if (!fs.existsSync(src)) {
    console.log(`  ⚠ missing: ${src}`);
    return;
  }
  const meta = await sharp(src).metadata();
  const srcW = meta.width ?? 0;
  const srcSize = fs.statSync(src).size;
  console.log(`\n${src} — ${srcW}×${meta.height}, ${(srcSize/1024).toFixed(1)} KB`);

  const dir = path.dirname(src);
  const base = path.basename(src, path.extname(src));

  for (const w of VARIANT_WIDTHS) {
    if (w > srcW) continue; // don't upscale

    // AVIF
    const avifOut = path.join(dir, `${base}-${w}.avif`);
    if (fresherThan(avifOut, src)) {
      console.log(`  ✓ ${path.basename(avifOut)} (up-to-date)`);
    } else {
      await sharp(src).resize({ width: w }).avif({ quality: AVIF_Q[w] }).toFile(avifOut);
      console.log(`  → ${path.basename(avifOut)} ${(fs.statSync(avifOut).size/1024).toFixed(1)} KB`);
    }

    // WebP — only for smaller widths; the source itself serves the 1600w webp slot
    if (WEBP_Q[w]) {
      const webpOut = path.join(dir, `${base}-${w}.webp`);
      if (fresherThan(webpOut, src)) {
        console.log(`  ✓ ${path.basename(webpOut)} (up-to-date)`);
      } else {
        await sharp(src).resize({ width: w }).webp({ quality: WEBP_Q[w] }).toFile(webpOut);
        console.log(`  → ${path.basename(webpOut)} ${(fs.statSync(webpOut).size/1024).toFixed(1)} KB`);
      }
    }
  }
}

console.log(`Generating AVIF + small-WebP variants for ${HERO_IMAGES.length} hero images…`);
for (const img of HERO_IMAGES) {
  try {
    await process(img);
  } catch (err) {
    console.error(`  ✗ failed: ${img} — ${err.message}`);
  }
}
console.log('\nDone.');
