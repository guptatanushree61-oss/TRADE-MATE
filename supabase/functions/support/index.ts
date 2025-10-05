// Supabase Edge Function: support
// Receives POST { name, email, message, user_id? }
// Inserts into support_messages using Service Role key and optionally sends email via SendGrid

import { serve } from 'std/server';

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const body = await req.json();
    const { name, email, message, user_id } = body || {};

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
    }

    // Insert into Supabase using PostgREST
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/support_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ name, email, message, user_id })
    });

    if (!insertRes.ok) {
      const txt = await insertRes.text();
      return new Response(JSON.stringify({ error: 'Insert failed', detail: txt }), { status: 500 });
    }

    const data = await insertRes.json();

    // Optionally send email via SendGrid
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (SENDGRID_API_KEY) {
      try {
        const emailBody = {
          personalizations: [{ to: [{ email: Deno.env.get('SUPPORT_EMAIL') || 'support@example.com' }] }],
          from: { email: Deno.env.get('FROM_EMAIL') || 'no-reply@example.com' },
          subject: `New support message from ${name}`,
          content: [{ type: 'text/plain', value: `From: ${name} <${email}>\n\n${message}` }]
        };

        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailBody)
        });
      } catch (e) {
        // Log but don't fail the request
        console.error('SendGrid error', e);
      }
    }

    return new Response(JSON.stringify({ ok: true, data }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});
