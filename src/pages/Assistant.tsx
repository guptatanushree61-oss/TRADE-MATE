import React, { useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendAssistantQuery } from '@/lib/assistant';

type Message = { id: string; role: 'user' | 'assistant' | 'system'; text: string };

const Assistant: React.FC = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { id: 's1', role: 'system', text: 'Assistant ready. Ask about features or inventory (e.g. "How much Rice is left?").' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const append = (m: Message) => setMessages((s) => [...s, m]);

  const send = async () => {
    const question = input.trim();
    if (!question) return;
    const userMsg: Message = { id: String(Date.now()), role: 'user', text: question };
    append(userMsg);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAssistantQuery(question);
      if (!res) throw new Error('No response');
      const assistantMsg: Message = { id: 'a' + Date.now(), role: 'assistant', text: res.answer };
      append(assistantMsg);
    } catch (err: any) {
      toast({ title: 'Assistant error', description: err?.message || 'Failed to get response' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout pageTitle={t('nav.help') + ' - Assistant'}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Assistant</h1>
          <p className="text-sm text-muted-foreground">Ask about the app features or your inventory. The assistant can securely query inventory when deployed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-auto p-4 border rounded-lg bg-background">
              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'self-end text-right' : 'self-start'}>
                  <div className={`inline-block px-3 py-2 rounded-md ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me something (e.g. how many Rice left)" />
              <Button onClick={send} disabled={loading}>{loading ? 'Thinking...' : 'Send'}</Button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-4 border rounded-md bg-white">
              <h3 className="font-semibold">Tips</h3>
              <ul className="mt-2 text-sm list-disc list-inside text-muted-foreground">
                <li>Ask about inventory: "How much Rice is left?"</li>
                <li>Ask about features: "How to add a product?"</li>
                <li>For production, deploy the server function with SUPABASE_SERVICE_ROLE_KEY for secure DB queries.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Assistant;
