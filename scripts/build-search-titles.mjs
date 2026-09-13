/**
 * Generate the search title catalogue from the finished Pagefind index.
 *
 * Runs after `npx pagefind …` (see the `build` / `build:index` scripts) and
 * writes `/search-titles.json` next to the index: one row per indexed page,
 * `[id, url, title]`, sorted. `src/lib/search-client.ts` loads it in the
 * browser so both search surfaces can rank, group and count Pagefind's result
 * references before fetching any result data.
 *
 * How it gets the data — and why this way:
 *
 *   - It runs the *installed, unmodified* Pagefind client JS/WASM out of the
 *     generated index, exactly as a browser would, and enumerates membership
 *     with `pagefind.search(null)`. No internal index format is parsed here
 *     and no new dependency is introduced.
 *   - `fetch` is replaced with an adapter that can only read files inside the
 *     one index directory. Nothing contacts the network.
 *   - Titles come from the *finished* index, not from per-file metadata
 *     observed while indexing, so body-exclusion rules have already been
 *     applied. There is no hand-maintained path list anywhere: a page is in
 *     the catalogue if and only if Pagefind indexed it.
 *
 * Usage: node scripts/build-search-titles.mjs [indexDir] [outFile]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_INDEX_DIR = '.vercel/output/static/pagefind';
const DEFAULT_OUT_FILE = '.vercel/output/static/search-titles.json';

/** Catalogue schema version — bump if the row shape ever changes. */
export const CATALOGUE_VERSION = 1;

/**
 * The same canonical-local-path rule the browser helper enforces: a single
 * leading slash, no scheme, no `//host`, no backslashes, no control
 * characters. Pagefind `--site` URLs are always of this shape.
 */
export function isCanonicalLocalPath(value) {
  if (typeof value !== 'string') return false;
  if (value.length === 0 || value.length > 2048) return false;
  if (value.charCodeAt(0) !== 47) return false;
  if (value.charCodeAt(1) === 47) return false;
  if (value.includes('\\')) return false;
  if (/[\u0000-\u001f\u007f-\u009f]/.test(value)) return false;
  return true;
}

/** Titles are stored with whitespace collapsed; matching normalises anyway. */
function tidyTitle(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

/**
 * Turn hydrated index members into the catalogue document.
 *
 * Throws if any member has a URL this site would refuse to link to: a hole in
 * the catalogue would make the search page fall back to its unavailable
 * surface at runtime, so it should fail the build instead of shipping.
 * Deterministic: sorted by URL then id.
 */
export function buildCatalogueDocument(records) {
  const problems = [];
  const byId = new Map();

  for (const record of records) {
    const id = record && typeof record.id === 'string' ? record.id : '';
    const url = record ? record.url : undefined;
    if (!id) {
      problems.push(`missing result id for url ${JSON.stringify(url ?? null)}`);
      continue;
    }
    if (!isCanonicalLocalPath(url)) {
      problems.push(`${id}: not a canonical local URL: ${JSON.stringify(url ?? null)}`);
      continue;
    }
    if (byId.has(id)) continue;
    byId.set(id, { id, url, title: tidyTitle(record.title) });
  }

  if (problems.length > 0) {
    throw new Error(`Pagefind index members could not be catalogued:\n  ${problems.join('\n  ')}`);
  }

  const entries = [...byId.values()]
    .sort((a, b) => (a.url === b.url ? (a.id < b.id ? -1 : a.id > b.id ? 1 : 0) : a.url < b.url ? -1 : 1))
    .map((entry) => [entry.id, entry.url, entry.title]);

  return {
    version: CATALOGUE_VERSION,
    fields: ['id', 'url', 'title'],
    count: entries.length,
    entries,
  };
}

/**
 * A `fetch` that can only read files inside `rootDir`. Anything else — a URL
 * with another scheme, a path that escapes the directory — is refused, so
 * running the index's own client code cannot reach the network or the rest of
 * the disk.
 */
export function createIndexOnlyFetch(rootDir) {
  const root = rootDir.endsWith(path.sep) ? rootDir : rootDir + path.sep;
  return async function indexOnlyFetch(input) {
    const url = new URL(String(input));
    if (url.protocol !== 'file:') {
      throw new Error(`Refused non-file request: ${url.protocol}`);
    }
    const filePath = fileURLToPath(url);
    if (!filePath.startsWith(root)) {
      throw new Error(`Refused read outside the index: ${filePath}`);
    }
    return new Response(await fs.readFile(filePath));
  };
}

/** Hydrate in small batches so a large index doesn't open every file at once. */
async function hydrateAll(results, batchSize = 32) {
  const records = [];
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    const data = await Promise.all(batch.map((result) => result.data()));
    batch.forEach((result, j) => {
      const item = data[j] ?? {};
      records.push({
        id: result.id,
        url: item.url,
        title: item.meta && typeof item.meta.title === 'string' ? item.meta.title : '',
      });
    });
  }
  return records;
}

/** Read the whole index through its own client and return catalogue records. */
export async function readIndexMembers(indexDir) {
  const root = path.resolve(indexDir);
  const entryPoint = path.join(root, 'pagefind.js');
  await fs.access(entryPoint);

  const previousFetch = globalThis.fetch;
  globalThis.fetch = createIndexOnlyFetch(root);
  try {
    const pagefind = await import(pathToFileURL(entryPoint).href);
    await pagefind.options({ basePath: pathToFileURL(root + path.sep).href, baseUrl: '/' });
    await pagefind.init();
    // A null term enumerates the whole index rather than running a query.
    const response = await pagefind.search(null);
    return await hydrateAll(response.results);
  } finally {
    globalThis.fetch = previousFetch;
  }
}

async function main(argv) {
  const indexDir = path.resolve(argv[0] ?? DEFAULT_INDEX_DIR);
  const outFile = path.resolve(argv[1] ?? DEFAULT_OUT_FILE);

  try {
    await fs.access(path.join(indexDir, 'pagefind.js'));
  } catch {
    throw new Error(
      `No Pagefind index at ${indexDir}. Run the Pagefind step first ` +
        `(npm run build:index), or pass the index directory as the first argument.`,
    );
  }

  const records = await readIndexMembers(indexDir);
  const document = buildCatalogueDocument(records);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(document) + '\n', 'utf8');
  process.stdout.write(
    `search catalogue: ${document.count} indexed pages -> ${path.relative(process.cwd(), outFile)}\n`,
  );
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`build-search-titles failed: ${error?.message ?? error}\n`);
    process.exitCode = 1;
  });
}
