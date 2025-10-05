import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X } from 'lucide-react';
import { sendAssistantQuery } from '@/lib/assistant';

type Msg = { id: string; role: 'user' | 'assistant'; text: string };

export const AssistantWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // scroll to bottom on open/messages
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [open, messages]);

  const append = (m: Msg) => setMessages((s) => [...s, m]);

  const suggestedQuestions = [
    'How much Rice is left?',
    'How much Sugar is left?',
    'How much Salt is left?',
    'How much Tea is left?',
    'How much payment is due?'
  ];

  const presetAnswers: Record<string, string> = {
    'How much Rice is left?': '5kg rice is left',
    'How much Sugar is left?': '7 kg sugar is left',
    'How much Salt is left?': '6kg salt is remaining',
  'How much Tea is left?': '8 kg tea is left',
    'How much payment is due?': '20,000rs are due',
  };

  const sendQuickQuestion = (q: string) => {
    const userMsg: Msg = { id: String(Date.now()), role: 'user', text: q };
    append(userMsg);
    const answer = presetAnswers[q] ?? "I couldn't find an answer.";
    // Append assistant reply immediately (no network call)
    append({ id: 'a' + Date.now(), role: 'assistant', text: answer });
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;
    const userMsg: Msg = { id: String(Date.now()), role: 'user', text: q };
    append(userMsg);
    setInput('');
    setLoading(true);
    try {
      const res = await sendAssistantQuery(q);
      const answer = res?.answer ?? 'I could not find an answer.';
      append({ id: 'a' + Date.now(), role: 'assistant', text: answer });
    } catch (err) {
      append({ id: 'a' + Date.now(), role: 'assistant', text: 'Error: failed to get response.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <Button className="rounded-full p-3 shadow-lg" onClick={() => setOpen(true)} aria-label="Open assistant">
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      {open && (
        <div className="w-80 max-w-[90vw] h-96 flex flex-col bg-white border rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <div className="font-medium">Assistant</div>
            </div>
            <div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 p-3 overflow-auto space-y-3 bg-background">
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <Button key={q} size="sm" onClick={() => sendQuickQuestion(q)}>{q}</Button>
                ))}
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-1.5 rounded-md ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about stock, sales, features..." onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} />
              <Button onClick={handleSend} disabled={loading}>{loading ? '...' : 'Send'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantWidget;
