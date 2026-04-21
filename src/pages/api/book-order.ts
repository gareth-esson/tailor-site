export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Book order endpoint [B11-order].
 *
 * Captures buyer details via Resend before redirecting to Stripe.
 * Returns { stripeUrl } on success so the client can redirect.
 *
 * Defences mirror /api/enquiry: Content-Type gate, body size cap,
 * per-field length limits, CR/LF stripping, in-memory rate limit.
 */

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

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

const VALID_BUYER_TYPES = ['individual', 'teacher', 'school_leader', 'commissioner'] as const;
type BuyerType = typeof VALID_BUYER_TYPES[number];

const BUYER_TYPE_LABELS: Record<BuyerType, string> = {
  individual: 'Individual / parent / carer',
  teacher: 'Teacher or school staff',
  school_leader: 'School leader',
  commissioner: 'Education commissioner / LA / trust',
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return json({ error: 'Unsupported content type' }, 415);
    }

    const ip = clientAddress ?? 'unknown';
    if (!rateLimit(ip)) {
      return json({ error: 'Too many requests — please try again shortly.' }, 429);
    }

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

    // Core fields — required for everyone
    const name         = validateField(body.name,          { required: true,  max: 120 });
    const email        = validateField(body.email,         { required: true,  max: 254 });
    const addressLine1 = validateField(body.address_line1, { required: true,  max: 200 });
    const addressLine2 = validateField(body.address_line2, { required: false, max: 200 });
    const city         = validateField(body.city,          { required: true,  max: 120 });
    const postcode     = validateField(body.postcode,      { required: true,  max: 12  });

    if (name == null || email == null || addressLine1 == null || city == null || postcode == null) {
      return json({ error: 'Missing or invalid required field' }, 400);
    }
    if (addressLine2 == null) {
      return json({ error: 'Optional field exceeded length limit' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Invalid email' }, 400);
    }

    // Validate postcode is vaguely UK-shaped (loose check)
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode)) {
      return json({ error: 'Please enter a valid UK postcode' }, 400);
    }

    // Buyer type
    const rawBuyerType = typeof body.buyer_type === 'string' ? body.buyer_type : '';
    if (!VALID_BUYER_TYPES.includes(rawBuyerType as BuyerType)) {
      return json({ error: 'Invalid buyer type' }, 400);
    }
    const buyerType = rawBuyerType as BuyerType;

    // Conditional fields
    const schoolName       = validateField(body.school_name,       { required: false, max: 200 });
    const orgName          = validateField(body.org_name,          { required: false, max: 200 });
    const role             = validateField(body.role,              { required: false, max: 120 });
    const keyStage         = validateField(body.key_stage,         { required: false, max: 80  });
    const contactPref      = validateField(body.contact_pref,      { required: false, max: 200 });
    const interestedInMore = body.interested_in_more === true;

    if (schoolName == null || orgName == null || role == null || keyStage == null || contactPref == null) {
      return json({ error: 'Optional field exceeded length limit' }, 400);
    }

    // School name required for teacher / school leader
    if ((buyerType === 'teacher' || buyerType === 'school_leader') && !schoolName) {
      return json({ error: 'School name is required' }, 400);
    }

    // Org name required for commissioner
    if (buyerType === 'commissioner' && !orgName) {
      return json({ error: 'Organisation name is required' }, 400);
    }

    const resendKey = import.meta.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return json({ error: 'Server configuration error' }, 500);
    }

    const stripeUrl = import.meta.env.BOOK_STRIPE_URL;
    if (!stripeUrl) {
      console.error('BOOK_STRIPE_URL not configured');
      return json({ error: 'Server configuration error' }, 500);
    }

    // Build email body
    const addressBlock = [addressLine1, addressLine2, city, postcode.toUpperCase()]
      .filter(Boolean)
      .join('\n');

    const lines: (string | null)[] = [
      `Name: ${name}`,
      `Email: ${email}`,
      ``,
      `--- Shipping address ---`,
      addressBlock,
      ``,
      `--- Buyer profile ---`,
      `Type: ${BUYER_TYPE_LABELS[buyerType]}`,
      schoolName  ? `School: ${schoolName}`       : null,
      orgName     ? `Organisation: ${orgName}`     : null,
      role        ? `Role: ${role}`                : null,
      keyStage    ? `Key stage / subject: ${keyStage}` : null,
    ];

    if (interestedInMore) {
      lines.push(``, `--- Follow-up interest ---`);
      if (buyerType === 'school_leader') {
        lines.push('Interested in: bulk copies / RSE sessions');
      } else if (buyerType === 'commissioner') {
        lines.push('Interested in: bulk orders / training programmes');
      }
      if (contactPref) {
        lines.push(`Preferred contact: ${contactPref}`);
      }
    }

    const emailBody = lines.filter((l) => l !== null).join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Okay to Ask Book <noreply@tailoreducation.org.uk>',
        to: ['otabook@tailoreducation.org.uk'],
        subject: `New book order — ${name}`,
        text: emailBody,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return json({ error: 'Failed to send confirmation' }, 500);
    }

    return json({ stripeUrl }, 200);
  } catch (err) {
    console.error('Book order API error:', err);
    return json({ error: 'Internal error' }, 500);
  }
};
