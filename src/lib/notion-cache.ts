/**
 * Local filesystem cache for Notion content.
 *
 * Why this exists:
 *   Astro dev re-runs `getStaticPaths` on every route mount. Without a
 *   cache, every `npm run dev` hammers Notion from a cold start and
 *   regularly trips the integration rate limiter, which then takes
 *   several minutes to release. That makes local iteration painful and
 *   slows down every preview verification loop.
 *
 * How it works:
 *   - Each fetcher result is serialised to `.cache/notion/{key}.json`.
 *   - On subsequent loads, if a cached file exists and is newer than
 *     the TTL (default: 1 day), it is returned immediately with no
 *     network activity.
 *   - A miss (or expired cache) falls through to the live fetcher, and
 *     the fresh result is written back to disk before being returned.
 *
 * How to force a refetch:
 *   - Delete the cache directory:  rm -rf .cache/notion
 *   - Or set env var:              NOTION_CACHE_REFRESH=1 npm run dev
 *   - Or pass { refresh: true } to `cached()` for a single key.
 *
 * Scope:
 *   This cache is for *dev-time* convenience. The production build on
 *   Vercel always runs from a cold workspace, so the cache is only ever
 *   populated during `npm run dev` / local `astro build`. `.cache/` is
 *   gitignored and never shipped.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const CACHE_DIR = path.resolve(process.cwd(), '.cache/notion');
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

// Global refresh switch — set NOTION_CACHE_REFRESH=1 to bypass all
// caches for a single run. Read once at module load so successive
// `cached()` calls in the same process see a stable value.
const FORCE_REFRESH =
  process.env.NOTION_CACHE_REFRESH === '1' ||
  process.env.NOTION_CACHE_REFRESH === 'true';

async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // mkdir with recursive:true swallows EEXIST; anything else bubbles
    // up on the first read/write and surfaces naturally.
  }
}

function cacheFilePath(key: string): string {
  // Keys are short identifiers (topics / questions / glossary / …);
  // sanitise aggressively so nothing weird lands on disk.
  const safe = key.replace(/[^a-z0-9_-]/gi, '_');
  return path.join(CACHE_DIR, `${safe}.json`);
}

interface CacheFile<T> {
  cachedAt: number;
  data: T;
}

async function readCache<T>(key: string, ttlMs: number): Promise<T | null> {
  const file = cacheFilePath(key);
  try {
    const stat = await fs.stat(file);
    const age = Date.now() - stat.mtimeMs;
    if (age > ttlMs) return null;

    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as CacheFile<T>;
    return parsed.data;
  } catch {
    // ENOENT, JSON parse errors, anything else — treat as a miss and
    // let the caller fall through to the live fetch.
    return null;
  }
}

async function writeCache<T>(key: string, data: T): Promise<void> {
  await ensureCacheDir();
  const file = cacheFilePath(key);
  const payload: CacheFile<T> = { cachedAt: Date.now(), data };
  await fs.writeFile(file, JSON.stringify(payload), 'utf8');
}

interface CachedOptions {
  /** Bypass the cache for this call and always refetch. */
  refresh?: boolean;
  /** Override the default 1-day TTL. */
  ttlMs?: number;
}

/**
 * Wrap a live fetcher so its result is persisted to disk and reused
 * on subsequent dev-server starts.
 *
 *   const topics = await cached('topics', () => fetchTopics());
 *
 * The key must be stable across runs (use a plain string literal).
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: CachedOptions = {},
): Promise<T> {
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
  const skipRead = FORCE_REFRESH || opts.refresh === true;

  if (!skipRead) {
    const hit = await readCache<T>(key, ttlMs);
    if (hit !== null) {
      console.log(`  ✓ ${key} — from cache`);
      return hit;
    }
  }

  const fresh = await fetcher();
  try {
    await writeCache(key, fresh);
  } catch (err) {
    console.warn(`  ! failed to write ${key} cache:`, (err as Error).message);
  }
  return fresh;
}
