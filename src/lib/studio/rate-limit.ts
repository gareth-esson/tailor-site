/**
 * Fixed-window rate limiter for the editor's login endpoint.
 *
 * Backed by Redis (the instance the stages tool already uses) so the
 * count is shared across serverless instances. An in-memory counter is
 * close to useless on a login endpoint: Vercel will happily hand an
 * attacker a fresh instance with an empty bucket. The in-memory path
 * here exists only for local dev, where there is one long-lived process.
 */

import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;
let client: RedisClient | null = null;

async function getRedis(): Promise<RedisClient | null> {
  const url = import.meta.env.REDIS_URL;
  if (!url) return null;
  if (client?.isOpen) return client;
  try {
    client = createClient({ url });
    client.on('error', (err) => console.error('studio/rate-limit redis:', err));
    await client.connect();
    return client;
  } catch (err) {
    console.error('studio/rate-limit: redis connect failed', err);
    client = null;
    return null;
  }
}

const memory = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/**
 * Count one attempt against `key`. Returns whether it is allowed and,
 * when it isn't, how long until the window rolls over.
 *
 * Fails *closed* when Redis is configured but unreachable: an editor
 * that briefly won't accept a login is a much smaller problem than one
 * that silently drops its brute-force protection.
 */
export async function consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const redis = await getRedis();

  if (redis) {
    try {
      const redisKey = `studio:rl:${key}`;
      const count = await redis.incr(redisKey);
      if (count === 1) await redis.expire(redisKey, windowSeconds);
      const ttl = await redis.ttl(redisKey);
      return { allowed: count <= limit, retryAfterSeconds: ttl > 0 ? ttl : windowSeconds };
    } catch (err) {
      console.error('studio/rate-limit: redis failed', err);
      return { allowed: false, retryAfterSeconds: windowSeconds };
    }
  }

  if (import.meta.env.REDIS_URL) {
    return { allowed: false, retryAfterSeconds: windowSeconds };
  }

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, retryAfterSeconds: windowSeconds };
  }
  entry.count += 1;
  return {
    allowed: entry.count <= limit,
    retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}
