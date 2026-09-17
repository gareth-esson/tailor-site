/**
 * Render a paper document route to a PDF.
 *
 * The site's printable resources are authored as Astro routes under
 * `/render/*` using the paper system (`src/styles/paper.css`), and this
 * turns one of those routes into the file a teacher downloads. The PDF is
 * committed to `public/downloads/` and served statically.
 *
 * Why generate rather than let the browser print:
 *
 *   - `window.print()` hands the output to the reader's print dialog, which
 *     supplies its own margins, its own headers and footers, and a "fit to
 *     page" scale. You cannot be consistent that way, and the audit sheet
 *     printed badly for exactly this reason.
 *   - Here the page size comes from the `@page` rule in paper.css
 *     (`preferCSSPageSize`), the margins come from `.paper` itself, and the
 *     browser adds nothing. The same bytes reach every teacher.
 *
 * Why this runs locally rather than in the Vercel build: the build image
 * does not ship Chromium, so generating during `astro build` would mean
 * carrying a browser download in the deploy and accepting that a failed
 * download breaks the site. These documents change rarely. Lesson PDFs
 * generated from the database are a different problem, solved in the app's
 * own serverless environment, and do not need the site build to grow a
 * browser.
 *
 * Setup (once):
 *   npm install
 *   npx playwright install chromium
 *
 * Usage:
 *   npm run dev                 # one terminal — serves the render route
 *   npm run pdf:audit-sheet     # another
 *
 * Or directly:
 *   node scripts/render-pdf.mjs <route> <outFile> [--base <origin>]
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const DEFAULT_BASE = 'http://localhost:4321';
const MANIFEST = 'scripts/pdf-manifest.json';

/**
 * Files whose contents can change what this PDF looks like. Recorded so
 * `tests/pdf-freshness.test.mjs` can tell when a committed PDF no longer
 * matches its source — the one real weakness of generating locally is that
 * a stale PDF opens perfectly and looks completely right.
 *
 * `tailor-site-v2.css` is deliberately NOT in this list even though
 * paper.css aliases its tokens. It is the main stylesheet and changes
 * constantly for screen reasons that cannot affect a printed sheet;
 * including it would fail the test every week for no reason, and a check
 * that cries wolf is worse than no check at all.
 */
function sourcesFor(route) {
  const slug = route.replace(/^\/+|\/+$/g, '').replace(/^render\//, '');
  return [
    `src/pages/render/${slug}.astro`,
    'src/styles/paper.css',
    'src/layouts/PaperLayout.astro',
  ];
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

async function writeManifest({ route, outFile, sources }) {
  const manifestPath = resolve(process.cwd(), MANIFEST);

  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    // First document — start a fresh manifest.
  }

  const entry = { route, generated: new Date().toISOString(), sources: {} };
  for (const src of sources) {
    entry.sources[src] = await sha256(resolve(process.cwd(), src));
  }
  entry.output = { sha256: await sha256(resolve(process.cwd(), outFile)) };

  manifest[outFile] = entry;

  const ordered = Object.fromEntries(Object.entries(manifest).sort());
  await writeFile(manifestPath, `${JSON.stringify(ordered, null, 2)}\n`);
  return manifestPath;
}

function parseArgs(argv) {
  const positional = [];
  let base = DEFAULT_BASE;

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--base') {
      base = argv[i + 1];
      i += 1;
    } else {
      positional.push(argv[i]);
    }
  }

  const [route, outFile] = positional;
  if (!route || !outFile) {
    console.error('Usage: node scripts/render-pdf.mjs <route> <outFile> [--base <origin>]');
    process.exit(1);
  }
  return { route, outFile, base: base.replace(/\/$/, '') };
}

/**
 * Fail early and legibly when the dev server isn't up. Without this the
 * failure surfaces as a Playwright navigation timeout thirty seconds later,
 * which reads like a browser problem rather than "you forgot npm run dev".
 */
async function assertServerUp(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error(`\nCannot reach ${url}`);
    console.error(`  ${err.message}`);
    console.error('\nStart the dev server first:  npm run dev\n');
    process.exit(1);
  }
}

async function main() {
  const { route, outFile, base } = parseArgs(process.argv.slice(2));
  const url = `${base}${route.startsWith('/') ? route : `/${route}`}`;
  const outPath = resolve(process.cwd(), outFile);

  await assertServerUp(url);

  // Imported here rather than at module scope so the usage error above
  // doesn't require Playwright to be installed to be readable.
  const { chromium } = await import('playwright');

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) {
      throw new Error(`${url} returned ${response ? response.status() : 'no response'}`);
    }

    // Web fonts load asynchronously. Rendering before they resolve produces
    // a PDF set in the fallback stack, which looks almost right and is
    // wrong — exactly the kind of failure that survives a glance.
    await page.evaluate(() => document.fonts.ready);

    // The screen preview paints a grey ground behind the sheets. `print`
    // emulation applies the @media print block so the PDF gets the real
    // document, not a picture of the preview.
    await page.emulateMedia({ media: 'print' });

    await mkdir(dirname(outPath), { recursive: true });

    await page.pdf({
      path: outPath,
      // paper.css owns both: `@page { size: A4 portrait }` and the padding
      // on `.paper`. The renderer must not add a second set.
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      // Without this the panel tint and the "must" flags print as nothing.
      printBackground: true,
    });

    if (consoleErrors.length > 0) {
      console.warn(`\n${consoleErrors.length} console error(s) during render:`);
      for (const e of consoleErrors.slice(0, 5)) console.warn(`  ${e}`);
    }

    // Record what this PDF was generated from, so drift is detectable.
    const sources = sourcesFor(route);
    await writeManifest({ route, outFile, sources });

    console.log(`\n  ${url}\n→ ${outFile}`);
    console.log(`  manifest: ${MANIFEST} (${sources.length} sources)\n`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
