export const prerender = false;

/**
 * School search endpoint — /api/schools?q=...
 *
 * Queries the gias_schools table (DfE GIAS register, England only).
 * Primary: FTS on name using the existing GIN index.
 * Fallback: ILIKE on name + local_authority.
 * Min 3 chars, max 20 results.
 *
 * Returns: [{ urn, name, local_authority, phase }]
 */

import type { APIRoute } from 'astro';
import postgres from 'postgres';

// Module-level singleton reused across warm invocations.
let _sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  if (!_sql) {
    const url = import.meta.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL not configured');
    _sql = postgres(url, { max: 1, idle_timeout: 20, connect_timeout: 10 });
  }
  return _sql;
}

function jsonRes(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').trim();
  if (q.length < 3) return jsonRes([]);

  try {
    const sql = getSql();

    // Primary: FTS on name via GIN index (idx_gias_name).
    const fts = await sql`
      SELECT urn, name, local_authority, phase
      FROM gias_schools
      WHERE status = 'Open'
        AND to_tsvector('english', name) @@ plainto_tsquery('english', ${q})
      ORDER BY ts_rank(to_tsvector('english', name), plainto_tsquery('english', ${q})) DESC
      LIMIT 20
    `;
    if (fts.length > 0) return jsonRes(fts);

    // Fallback: ILIKE on name + local_authority.
    const ilike = await sql`
      SELECT urn, name, local_authority, phase
      FROM gias_schools
      WHERE status = 'Open'
        AND (name ILIKE ${'%' + q + '%'} OR local_authority ILIKE ${'%' + q + '%'})
      ORDER BY name
      LIMIT 20
    `;
    return jsonRes(ilike);
  } catch (err) {
    console.error('[/api/schools] error:', err);
    return jsonRes({ error: 'Search unavailable' }, 500);
  }
};
