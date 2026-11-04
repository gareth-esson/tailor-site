/**
 * Turn the feelings card SVGs into the PDFs a printer asks for.
 *
 * Run by scripts/build-feelings-cards.py after it writes the SVGs; it can
 * also be run on its own. Writes two files into print/feelings-cards/:
 *
 *   feelings-cards-fronts.pdf  one page per front, in file order
 *   feelings-cards-back.pdf    the single back every card shares
 *
 * Each page is the full artboard, bleed included, so the page size comes
 * from the SVG and the printer trims to the card. The SVGs are inlined
 * rather than loaded as images so Chromium draws them as vector paths.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const DIR = resolve(process.cwd(), 'print/feelings-cards');

async function pagesFrom(files) {
  const svgs = await Promise.all(files.map((f) => readFile(f, 'utf8')));
  const { width, height } = svgs[0].match(/width="(?<width>[\d.]+mm)" height="(?<height>[\d.]+mm)"/).groups;
  if (!svgs.every((s) => s.includes(`width="${width}" height="${height}"`))) {
    throw new Error('Every artboard must be the same size to share one PDF');
  }
  const html = `<!doctype html><html><head><style>
    @page { size: ${width} ${height}; margin: 0; }
    html, body { margin: 0; padding: 0; }
    .page { width: ${width}; height: ${height}; break-after: page; overflow: hidden; }
    .page:last-child { break-after: auto; }
    .page svg { display: block; }
  </style></head><body>${svgs.map((s) => `<div class="page">${s}</div>`).join('')}</body></html>`;
  return { html, width, height };
}

async function writePdf(browser, files, outFile) {
  const { html } = await pagesFrom(files);
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: outFile,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
  });
  await page.close();
  console.log(`${files.length} page(s) -> ${outFile.replace(`${process.cwd()}/`, '')}`);
}

const fronts = (await readdir(join(DIR, 'fronts')))
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((f) => join(DIR, 'fronts', f));

const browser = await chromium.launch();
try {
  await writePdf(browser, fronts, join(DIR, 'feelings-cards-fronts.pdf'));
  await writePdf(browser, [join(DIR, 'back.svg')], join(DIR, 'feelings-cards-back.pdf'));
} finally {
  await browser.close();
}
