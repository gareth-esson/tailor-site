export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, school, service, keystage, timing, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !school?.trim() || !service?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send via Resend (API key from environment)
    const resendKey = import.meta.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailBody = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `School: ${school.trim()}`,
      `Service: ${service.trim()}`,
      keystage?.trim() ? `Key stage / year group: ${keystage.trim()}` : null,
      timing?.trim() ? `Preferred timing: ${timing.trim()}` : null,
      message?.trim() ? `\nMessage:\n${message.trim()}` : null,
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
        from: 'Tailor Education <noreply@tailoreducation.org.uk>',
        to: ['hello@tailoreducation.org.uk'],
        subject: `New enquiry: ${service.trim()} — ${school.trim()}`,
        text: emailBody,
        reply_to: email.trim(),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Enquiry API error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
