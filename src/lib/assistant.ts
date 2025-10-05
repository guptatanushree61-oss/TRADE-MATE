export type AssistantResponse = { answer?: string; error?: string };

const EDGE_ORIGIN = (import.meta.env.VITE_EDGE_FUNCTION_ORIGIN as string) || (import.meta.env.VITE_APP_ORIGIN as string) || '';

export async function sendAssistantQuery(query: string): Promise<AssistantResponse> {
  // Build endpoint: prefer explicit edge origin, fallback to a relative serverless path
  const endpoint = EDGE_ORIGIN ? `${EDGE_ORIGIN.replace(/\/+$/,'')}/assistant` : '/.netlify/functions/assistant';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `Server error: ${text}` };
    }

    const json = await res.json().catch(() => null);
    if (!json) return { error: 'Invalid JSON response from assistant' };
    return { answer: json.answer };
  } catch (err) {
    return { error: String(err) };
  }
}
