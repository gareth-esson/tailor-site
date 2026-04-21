export const prerender = false;

import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { createClient } from 'redis';

/**
 * Stripe webhook endpoint — handles checkout.session.completed.
 *
 * On successful payment:
 * 1. Verifies the Stripe-Signature header (rejects replays > 5 min old).
 * 2. Looks up the pending order in Redis by client_reference_id.
 * 3. Sends the order email to otabook@tailoreducation.org.uk via Resend.
 * 4. Deletes the Redis entry.
 */

const BUYER_TYPE_LABELS: Record<string, string> = {
  individual:    'Individual / parent / carer',
  teacher:       'Teacher or school staff',
  school_leader: 'School leader',
  commissioner:  'Education commissioner / LA / trust',
};

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({ url: import.meta.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis error:', err));
  }
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

function verifyStripeSignature(payload: string, sigHeader: string, secret: string): boolean {
  // Parse t= and all v1= values from the header.
  const timestamp = sigHeader.match(/t=(\d+)/)?.[1];
  const v1sigs = [...sigHeader.matchAll(/v1=([a-f0-9]+)/g)].map((m) => m[1]);

  if (!timestamp || v1sigs.length === 0) return false;

  // Reject events older than 5 minutes to prevent replay attacks.
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  return v1sigs.some((sig) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
    } catch {
      return false;
    }
  });
}

interface OrderData {
  name: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postcode: string;
  buyer_type: string;
  school_name: string;
  org_name: string;
  role: string;
  key_stage: string;
  interested_in_more: boolean;
  contact_pref: string;
}

function buildEmailBody(order: OrderData, stripeInfo: { amountGBP: string; stripeSessionId: string }): string {
  const addressBlock = [order.address_line1, order.address_line2, order.city, order.postcode.toUpperCase()]
    .filter(Boolean)
    .join('\n');

  const lines: (string | null)[] = [
    `Name: ${order.name}`,
    `Email: ${order.email}`,
    ``,
    `--- Shipping address ---`,
    addressBlock,
    ``,
    `--- Payment ---`,
    `Amount: £${stripeInfo.amountGBP}`,
    `Stripe session: ${stripeInfo.stripeSessionId}`,
    ``,
    `--- Buyer profile ---`,
    `Type: ${BUYER_TYPE_LABELS[order.buyer_type] ?? order.buyer_type}`,
    order.school_name ? `School: ${order.school_name}`         : null,
    order.org_name    ? `Organisation: ${order.org_name}`      : null,
    order.role        ? `Role: ${order.role}`                  : null,
    order.key_stage   ? `Key stage / subject: ${order.key_stage}` : null,
  ];

  if (order.interested_in_more) {
    lines.push(``, `--- Follow-up interest ---`);
    if (order.buyer_type === 'school_leader') {
      lines.push('Interested in: bulk copies / RSE sessions');
    } else if (order.buyer_type === 'commissioner') {
      lines.push('Interested in: bulk orders / training programmes');
    }
    if (order.contact_pref) {
      lines.push(`Preferred contact: ${order.contact_pref}`);
    }
  }

  return lines.filter((l) => l !== null).join('\n');
}

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  const resendKey     = import.meta.env.RESEND_API_KEY;
  const redisUrl      = import.meta.env.REDIS_URL;

  if (!webhookSecret || !resendKey || !redisUrl) {
    console.error('Missing env vars for stripe-webhook');
    return new Response('Server configuration error', { status: 500 });
  }

  const sigHeader = request.headers.get('stripe-signature') ?? '';
  const rawBody   = await request.text();

  if (!verifyStripeSignature(rawBody, sigHeader, webhookSecret)) {
    console.error('Stripe signature verification failed');
    return new Response('Invalid signature', { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('Ignored', { status: 200 });
  }

  const session = event.data.object;
  const orderId = typeof session.client_reference_id === 'string' ? session.client_reference_id : null;

  if (!orderId) {
    console.error('checkout.session.completed received with no client_reference_id');
    return new Response('OK', { status: 200 });
  }

  try {
    const redis = await getRedis();
    const raw   = await redis.get(`order:${orderId}`);

    if (!raw) {
      console.error(`No order found in Redis for id: ${orderId}`);
      return new Response('OK', { status: 200 });
    }

    const order: OrderData = JSON.parse(raw);

    const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : 0;
    const amountGBP   = (amountTotal / 100).toFixed(2);
    const sessionId   = typeof session.id === 'string' ? session.id : 'unknown';

    const emailBody = buildEmailBody(order, { amountGBP, stripeSessionId: sessionId });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     'Okay to Ask Book <noreply@mail.tailoreducation.org.uk>',
        to:       ['otabook@tailoreducation.org.uk'],
        subject:  `New book order — ${order.name}`,
        text:     emailBody,
        reply_to: order.email,
      }),
    });

    if (!res.ok) {
      console.error('Resend error:', await res.text());
      // Return 200 to Stripe so it doesn't retry — log the failure instead.
    } else {
      await redis.del(`order:${orderId}`);
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    // Return 200 so Stripe doesn't keep retrying on transient errors.
  }

  return new Response('OK', { status: 200 });
};
