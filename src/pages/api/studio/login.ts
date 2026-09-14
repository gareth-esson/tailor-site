export const prerender = false;

import type { APIRoute } from 'astro';
import { cookieHeader, createSessionToken, isConfigured, verifyPassword } from '../../../lib/studio/auth';
import { consume } from '../../../lib/studio/rate-limit';
import { clientIp, json, readJson } from './_shared';

/** Ten tries an hour per IP. Generous for a typo, hopeless for a
 *  dictionary. The global bucket catches an attacker rotating IPs. */
const PER_IP_LIMIT = 10;
const GLOBAL_LIMIT = 60;
const WINDOW_SECONDS = 60 * 60;

export const POST: APIRoute = async ({ request }) => {
  if (!isConfigured()) {
    return json({ error: 'The editor is not configured on this deployment yet.' }, 503);
  }

  const ip = clientIp(request);
  const [perIp, global] = await Promise.all([
    consume(`login:${ip}`, PER_IP_LIMIT, WINDOW_SECONDS),
    consume('login:global', GLOBAL_LIMIT, WINDOW_SECONDS),
  ]);
  const blocked = !perIp.allowed ? perIp : !global.allowed ? global : null;
  if (blocked) {
    return json({ error: 'Too many sign-in attempts. Try again later.' }, 429, {
      'Retry-After': String(blocked.retryAfterSeconds),
    });
  }

  const body = await readJson(request);
  if (body instanceof Response) return body;

  if (!verifyPassword(body.password)) {
    // Deliberately vague: no hint about whether the passphrase was
    // close, and the same wording whatever went wrong.
    return json({ error: 'That passphrase is not right.' }, 401);
  }

  return json({ ok: true }, 200, { 'Set-Cookie': cookieHeader(createSessionToken()) });
};
