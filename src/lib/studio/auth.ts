/**
 * Session auth for the post editor.
 *
 * One shared passphrase (STUDIO_PASSWORD) exchanged for a signed,
 * expiring cookie. No user accounts — there is one editor, and adding a
 * user table for one person would be more surface area, not less.
 *
 * The cookie is an HMAC over its own payload, so the server holds no
 * session state: nothing to expire from Redis, nothing to lose when a
 * serverless instance recycles. Rotating STUDIO_SESSION_SECRET
 * invalidates every outstanding session at once, which is the recovery
 * path if a laptop goes missing.
 */

import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

export const COOKIE_NAME = 'tailor_studio';
/** Long enough to write a post without re-authenticating; short enough
 *  that a forgotten open tab doesn't stay editable for a fortnight. */
const SESSION_TTL_SECONDS = 12 * 60 * 60;

function secret(): string {
  const value = import.meta.env.STUDIO_SESSION_SECRET;
  if (!value) throw new Error('STUDIO_SESSION_SECRET is not configured');
  return value;
}

function b64url(buf: Buffer): string {
  return buf.toString('base64url');
}

function sign(payload: string): string {
  return b64url(createHmac('sha256', secret()).update(payload).digest());
}

/** Constant-time compare that doesn't leak length through an early
 *  return. Hashing both sides first makes the compared buffers
 *  equal-length whatever the inputs were. */
function safeEqual(a: string, b: string): boolean {
  const ha = createHmac('sha256', secret()).update(a).digest();
  const hb = createHmac('sha256', secret()).update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Is the editor configured at all? Used to fail loudly with a setup
 *  message rather than a confusing 401. */
export function isConfigured(): boolean {
  const hasSecrets = Boolean(import.meta.env.STUDIO_PASSWORD && import.meta.env.STUDIO_SESSION_SECRET);
  // Locally the editor writes to the working tree, so it needs no
  // GitHub credentials. Every deployed environment does.
  const hasGitHub = Boolean(import.meta.env.STUDIO_GITHUB_TOKEN && import.meta.env.STUDIO_GITHUB_REPO);
  return hasSecrets && (hasGitHub || Boolean(import.meta.env.DEV));
}

export function verifyPassword(input: unknown): boolean {
  const expected = import.meta.env.STUDIO_PASSWORD;
  if (!expected || typeof input !== 'string' || input.length === 0) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const payload = b64url(
    Buffer.from(
      JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
        jti: randomBytes(8).toString('hex'),
      }),
    ),
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: unknown): boolean {
  if (typeof token !== 'string') return false;
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof exp === 'number' && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** Read the session cookie straight off the request. Astro's cookie
 *  helper isn't available in every context this is called from. */
export function sessionFromRequest(request: Request): boolean {
  const header = request.headers.get('cookie');
  if (!header) return false;
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === COOKIE_NAME) return verifySessionToken(rest.join('='));
  }
  return false;
}

export function cookieHeader(token: string | null): string {
  const attrs = [
    `${COOKIE_NAME}=${token ?? ''}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${token ? SESSION_TTL_SECONDS : 0}`,
  ];
  // Secure would make the cookie unusable over plain-HTTP localhost.
  if (!import.meta.env.DEV) attrs.push('Secure');
  return attrs.join('; ');
}
