import { supabase } from '@/integrations/supabase/client';

export type SupportMessage = {
  name: string;
  email: string;
  message: string;
  user_id?: string | null;
};

/**
 * Insert a support message into `support_messages` table.
 * Expected columns: id (uuid), name (text), email (text), message (text), user_id (uuid), created_at (timestamptz)
 */
export async function sendSupportMessage(payload: SupportMessage) {
  const useEdge = import.meta.env.VITE_USE_EDGE_FUNCTION === 'true';

  if (useEdge) {
    const origin = import.meta.env.VITE_EDGE_FUNCTION_ORIGIN || '';
    try {
      const res = await fetch(`${origin}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return { data: null, error: new Error(json?.error || 'Edge function error'), edgeResult: json };
      }
      return { data: json?.data ?? json, error: null, edgeResult: json };
    } catch (err) {
      return { data: null, error: err, edgeResult: null };
    }
  }

  // Fallback: direct insert into Supabase from client (existing behavior)
  const { data, error } = await supabase.from('support_messages').insert([payload]);
  return { data, error };
}
