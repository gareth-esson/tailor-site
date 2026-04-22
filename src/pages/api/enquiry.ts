export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Enquiry form endpoint.
 *
 * Defences:
 * - Reject non-JSON Content-Type (deters drive-by form replayers).
 * - Hard-cap body size to 8 KB (prevents someone pushing a massive
 *   payload through our Resend account).
 * - Per-field length caps + required-field validation.
 * - Strip CR/LF from single-line fields so attackers can't inject
 *   additional headers into the email subject.
 * - Basic IP rate limit: max 3 submissions per 60 seconds per IP.
 *   This is in-memory — adequate for a low-traffic form on a single
 *   Vercel region, but won't prevent distributed abuse. If spam
 *   becomes a problem, swap for Vercel KV / Upstash token bucket +
 *   add Turnstile/hCaptcha.
 */

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;

// In-memory rate-limit bucket. Keyed by client IP. Survives as long
// as the serverless instance does (typically minutes), then resets.
const rateLimitBuckets = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitBuckets.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitBuckets.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateLimitBuckets.set(ip, recent);
  return true;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function stripNewlines(s: string): string {
  return s.replace(/[\r\n]+/g, ' ').trim();
}

// Field-level validation: required flag + max length. Returns a
// cleaned string or null if the value is invalid.
function validateField(
  raw: unknown,
  { required, max, allowNewlines = false }: { required: boolean; max: number; allowNewlines?: boolean },
): string | null {
  if (raw == null || typeof raw !== 'string') return required ? null : '';
  const trimmed = raw.trim();
  if (required && trimmed.length === 0) return null;
  if (trimmed.length > max) return null;
  return allowNewlines ? trimmed : stripNewlines(trimmed);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Content-Type gate.
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return json({ error: 'Unsupported content type' }, 415);
    }

    // Rate limit (best-effort).
    const ip = clientAddress ?? 'unknown';
    if (!rateLimit(ip)) {
      return json({ error: 'Too many requests — please try again shortly.' }, 429);
    }

    // Bound the body read. Read as text first so we can size-check.
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: 'Request too large' }, 413);
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
    if (typeof body !== 'object' || body === null) {
      return json({ error: 'Invalid JSON' }, 400);
    }

    // Honeypot: if `website` is filled, it's a bot. Return 200 so the
    // bot can't distinguish success from our reject — they go away
    // thinking the submission landed.
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      return json({ success: true }, 200);
    }

    // Cloudflare Turnstile verification. In dev, use the test secret
    // that always passes so we don't need localhost hostname allowlisted.
    const turnstileSecret = import.meta.env.DEV
      ? '1x0000000000000000000000000000000AA'
      : import.meta.env.TURNSTILE_SECRET_KEY;

    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET_KEY not configured');
      return json({ error: 'Server configuration error' }, 500);
    }

    const tsToken = typeof body.cf_turnstile_response === 'string'
      ? body.cf_turnstile_response
      : '';
    if (!tsToken) {
      return json({ error: 'Human verification failed. Please refresh and try again.' }, 400);
    }

    const tsForm = new URLSearchParams();
    tsForm.set('secret', turnstileSecret);
    tsForm.set('response', tsToken);
    tsForm.set('remoteip', clientAddress ?? '');

    try {
      const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: tsForm,
      });
      const tsData = (await tsRes.json()) as { success: boolean; 'error-codes'?: string[] };
      if (!tsData.success) {
        console.warn('Turnstile rejected:', tsData['error-codes']);
        return json({ error: 'Human verification failed. Please try again.' }, 400);
      }
    } catch (err) {
      console.error('Turnstile verify error:', err);
      return json({ error: 'Verification unavailable. Please try again shortly.' }, 503);
    }

    // Per-field validation.
    const name = validateField(body.name, { required: true, max: 120 });
    const email = validateField(body.email, { required: true, max: 254 });
    const role = validateField(body.role, { required: true, max: 32 });
    const school = validateField(body.school, { required: false, max: 200 });
    const organisation = validateField(body.organisation, { required: false, max: 200 });
    const service = validateField(body.service, { required: true, max: 120 });
    const keystage = validateField(body.keystage, { required: false, max: 80 });
    const message = validateField(body.message, { required: false, max: 3000, allowNewlines: true });

    // Role must be one of the known values.
    const allowedRoles = new Set([
      'teacher', 'senior_leader', 'governor', 'parent',
      'youth_worker', 'commissioner', 'funder', 'researcher', 'press', 'other',
    ]);
    if (role != null && !allowedRoles.has(role)) {
      return json({ error: 'Invalid role' }, 400);
    }

    // school_urn: optional positive integer
    let schoolUrn: number | null = null;
    if (body.school_urn != null && body.school_urn !== '') {
      const raw = Number(body.school_urn);
      if (!Number.isInteger(raw) || raw <= 0 || raw > 9_999_999) {
        return json({ error: 'Invalid school_urn' }, 400);
      }
      schoolUrn = raw;
    }

    if (name == null || email == null || role == null || service == null) {
      return json({ error: 'Missing or invalid required field' }, 400);
    }
    if (school == null || organisation == null || keystage == null || message == null) {
      return json({ error: 'Optional field exceeded length limit' }, 400);
    }

    // Email format.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Invalid email' }, 400);
    }

    // Resend key presence.
    const resendKey = import.meta.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return json({ error: 'Server configuration error' }, 500);
    }

    const roleLabels: Record<string, string> = {
      teacher:       'Teacher / Teaching assistant',
      senior_leader: 'Senior leader',
      governor:      'Governor / Trustee',
      parent:        'Parent / Carer',
      youth_worker:  'Youth worker',
      commissioner:  'Commissioner',
      funder:        'Funder',
      researcher:    'Researcher / Academic',
      press:         'Press / Media',
      other:         'Other',
    };
    const roleLabel = roleLabels[role] ?? role;

    const schoolLine = school
      ? (schoolUrn ? `School: ${school} (URN: ${schoolUrn})` : `School: ${school}`)
      : null;
    const orgLine = organisation
      ? (role === 'press' ? `Publication: ${organisation}` : `Organisation: ${organisation}`)
      : null;

    const emailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Role: ${roleLabel}`,
      schoolLine,
      orgLine,
      `Service: ${service}`,
      keystage ? `Key stage / year group: ${keystage}` : null,
      message ? `\nMessage:\n${message}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Tailor Education <noreply@mail.tailoreducation.org.uk>',
        to: ['hello@tailoreducation.org.uk'],
        subject: (() => {
          const ctx = school || organisation;
          const prefix = role === 'press' ? 'Press enquiry' : 'New enquiry';
          return ctx ? `${prefix}: ${service} — ${ctx}` : `${prefix}: ${service}`;
        })(),
        text: emailBody,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return json({ error: 'Failed to send email' }, 500);
    }

    return json({ success: true }, 200);
  } catch (err) {
    console.error('Enquiry API error:', err);
    return json({ error: 'Internal error' }, 500);
  }
};
