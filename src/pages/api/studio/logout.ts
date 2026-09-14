export const prerender = false;

import type { APIRoute } from 'astro';
import { cookieHeader } from '../../../lib/studio/auth';
import { json } from './_shared';

export const POST: APIRoute = async () =>
  json({ ok: true }, 200, { 'Set-Cookie': cookieHeader(null) });
