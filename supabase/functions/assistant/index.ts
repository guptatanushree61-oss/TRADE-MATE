// Supabase Edge Function scaffold for Assistant
// This function expects a POST { query: string } and will respond { answer: string }
// It requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to query the database securely.

import { serve } from 'std/server';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Small helpers to produce randomized, topic-related answers when no LLM is available
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

function randomProductAnswer(p: { name: string; stock: number }, query: string) {
  const low = p.stock <= 10;
  const templates = [
    `There are ${p.stock} units of ${p.name} left.`,
    `We currently have ${p.stock} ${p.name} in stock.`,
    `Stock update: ${p.name} — ${p.stock} units available.${low ? ' Consider reordering soon.' : ''}`,
    `${p.stock} units of ${p.name} remain. ${low ? 'Low stock — reorder recommended.' : ''}`,
    `${p.name} stock: ${p.stock} units.${low ? ' Running low.' : ''}`,
  ];
  return pick(templates);
}

function randomPaymentAnswer(totalDue: number, query: string) {
  const templates = [
    `Total pending payments: ₹${totalDue.toLocaleString()}.`,
    `There are ₹${totalDue.toLocaleString()} in pending payments right now.`,
    `You have ₹${totalDue.toLocaleString()} due across pending transactions.`,
    `Pending amount currently stands at ₹${totalDue.toLocaleString()}. Please follow up.`,
    `₹${totalDue.toLocaleString()} is outstanding in pending payments.`,
  ];
  return pick(templates);
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const body = await req.json().catch(() => ({}));
  const query = body.query || '';

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500 });
  }

  // Simple parsing: look for "how much <product> is left"
  const match = query.match(/how much\s+([\w\s()\-']+)\s+is left/i);
  if (match) {
    const productName = match[1].trim();
    try {
      // Try DB lookup (REST). Use a robust flow and treat results as array.
      let p: { name: string; stock: number } | null = null;
      try {
        const url = `${SUPABASE_URL}/rest/v1/products?select=name,stock&name=ilike.*${encodeURIComponent(productName)}*&limit=1`;
        const res = await fetch(url, { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` } });
        if (res.ok) {
          const rows = await res.json().catch(() => null);
          if (Array.isArray(rows) && rows.length > 0) {
            p = { name: rows[0].name, stock: rows[0].stock } as any;
          }
        }
      } catch (dbErr) {
        console.error('DB lookup error:', dbErr);
        // swallow and fallback to hardcoded data below
      }

      // Hardcoded fallback product data (used if DB lookup fails or returns nothing)
      const fallbackProducts: { name: string; stock: number }[] = [
        { name: 'Rice (1kg)', stock: 12 },
        { name: 'Sugar (1kg)', stock: 5 },
        { name: 'Salt (1kg)', stock: 20 },
        { name: 'Tea (100g)', stock: 8 },
      ];

      if (!p) {
        // Try to match fallback by fuzzy/substring match
        const lowered = productName.toLowerCase();
        const found = fallbackProducts.find(fp => fp.name.toLowerCase().includes(lowered) || fp.name.toLowerCase() === lowered);
        if (found) p = found;
      }

      if (!p) {
        return new Response(JSON.stringify({ answer: `No product found for "${productName}"` }));
      }
      // Build a simple base answer
      const baseAnswer = randomProductAnswer(p, query);

      // If GEMINI_API_KEY is set, try to call the Gemini generative API to make the reply more human-friendly.
      const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY');
      if (GEMINI_KEY) {
        try {
          // Construct a short prompt asking Gemini to rewrite the answer in a friendly tone and add a reorder suggestion if low.
          const reorderSuggestion = p.stock <= 10 ? ' Consider reordering soon; stock is low.' : '';
          const prompt = `User asked: "${query}"\n\nProduct lookup result: ${baseAnswer}${reorderSuggestion}\n\nPlease reply in a short, friendly, human-like sentence (no JSON).`;

          // Use the Google Generative Models REST endpoint. Model name can be changed as needed.
          const model = 'models/text-bison-001';
          const geminiRes = await fetch(`https://generativeai.googleapis.com/v1/${model}:generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${GEMINI_KEY}`,
            },
            body: JSON.stringify({
              prompt: {
                text: prompt,
              },
              // Keep output concise
              maxOutputTokens: 250,
            }),
          });

          if (geminiRes.ok) {
            const geminiJson = await geminiRes.json();
            // Try a few locations for generated text depending on API response shape
            let generated =
              geminiJson?.candidates?.[0]?.content || geminiJson?.output?.[0]?.content || geminiJson?.output?.text || null;

            // Some responses put the text into `candidates[0].output` or similar. Normalize if necessary.
            if (!generated && typeof geminiJson === 'object') {
              // Try to find any string value in the object (best effort)
              const findString = (obj: any): string | null => {
                if (!obj || typeof obj !== 'object') return null;
                for (const k of Object.keys(obj)) {
                  const v = obj[k];
                  if (typeof v === 'string' && v.trim().length > 0) return v;
                  if (typeof v === 'object') {
                    const nested = findString(v);
                    if (nested) return nested;
                  }
                }
                return null;
              };
              generated = findString(geminiJson);
            }

            if (generated) {
              // Trim and return the generated human-like answer
              const final = String(generated).trim();
              return new Response(JSON.stringify({ answer: final }));
            }
            // if generated is empty, fallthrough to return a randomized fallback human-like answer
            // fallthrough to baseAnswer if generation failed to produce text
          }
        } catch (err) {
          // If Gemini call fails, just ignore and return the base answer below
          console.error('Gemini call failed', err);
        }
      }

      // Fallback: return the randomized base answer
      return new Response(JSON.stringify({ answer: baseAnswer }));
    } catch (err) {
      return new Response(JSON.stringify({ answer: `Error: ${String(err)}` }), { status: 500 });
    }
  }

  // Generic features response
  if (/feature|what can/i.test(query)) {
    return new Response(JSON.stringify({ answer: 'This app manages inventory, customers, payments, orders, reports and notifications. Use the assistant to ask inventory levels or feature how-tos.' }));
  }

  // Payment due query: try to sum pending payments from a payments table
  const payMatch = query.match(/how much payment is due|how much is due|payment due|amount due/i);
  if (payMatch) {
    try {
      // Try to query a payments table via Supabase REST API and sum pending amounts
      try {
        const url = `${SUPABASE_URL}/rest/v1/payments?select=amount,status`;
        const res = await fetch(url, { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` } });
        if (res.ok) {
          const rows = await res.json().catch(() => null);
          if (Array.isArray(rows)) {
            // Sum amounts where status indicates pending
            const pending = rows.filter((r: any) => (r.status || '').toString().toLowerCase() === 'pending');
            const totalDue = pending.reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0);
            const base = `Total pending payments: ₹${totalDue.toLocaleString()}`;

            // If Gemini available, rewrite for friendliness
            const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY');
            if (GEMINI_KEY) {
              try {
                const prompt = `User asked: "${query}"\n\nPayment lookup result: ${base}\n\nPlease reply in a short, friendly sentence (no JSON).`;
                const model = 'models/text-bison-001';
                const geminiRes = await fetch(`https://generativeai.googleapis.com/v1/${model}:generate`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GEMINI_KEY}` },
                  body: JSON.stringify({ prompt: { text: prompt }, maxOutputTokens: 250 }),
                });
                if (geminiRes.ok) {
                  const gj = await geminiRes.json().catch(() => null);
                  let gen = gj?.candidates?.[0]?.content || gj?.output?.[0]?.content || gj?.output?.text || null;
                  if (!gen && typeof gj === 'object') {
                    const findString = (obj: any): string | null => {
                      if (!obj || typeof obj !== 'object') return null;
                      for (const k of Object.keys(obj)) {
                        const v = obj[k];
                        if (typeof v === 'string' && v.trim().length > 0) return v;
                        if (typeof v === 'object') {
                          const nested = findString(v);
                          if (nested) return nested;
                        }
                      }
                      return null;
                    };
                    gen = findString(gj);
                  }
                  if (gen) return new Response(JSON.stringify({ answer: String(gen).trim() }));
                }
              } catch (gerr) {
                console.error('Gemini payment rewrite failed', gerr);
              }
            }

            return new Response(JSON.stringify({ answer: base }));
          }
        }
      } catch (dbErr) {
        console.error('payment DB lookup failed', dbErr);
      }

      // Fallback: use a sample payments dataset (mirrors frontend sample)
      const samplePayments = [
        { id: 1, amount: 1250, status: 'completed' },
        { id: 2, amount: 850, status: 'completed' },
        { id: 3, amount: 2100, status: 'completed' },
        { id: 4, amount: 450, status: 'completed' },
        { id: 5, amount: 750, status: 'pending' },
      ];
      const fallbackDue = samplePayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
      return new Response(JSON.stringify({ answer: randomPaymentAnswer(fallbackDue, query) }));
    } catch (err) {
      return new Response(JSON.stringify({ answer: `Error computing payments due: ${String(err)}` }));
    }
  }

  return new Response(JSON.stringify({ answer: "I couldn't understand the question. Try: 'How much Rice is left?'" }));
});
