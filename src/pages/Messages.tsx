import React, { useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  name: string;
  phone?: string;
}

const randomUsers: User[] = [
  { id: 'u1', name: 'Raj Patel', phone: '+91-9876543210' },
  { id: 'u2', name: 'Priya Singh', phone: '+91-9123456780' },
  { id: 'u3', name: 'Amit Sharma', phone: '+91-9012345678' },
  { id: 'u4', name: 'Neha Gupta', phone: '+91-9988776655' },
  { id: 'u5', name: 'Suresh Kumar', phone: '+91-9001122334' },
];

export const Messages: React.FC = () => {
  const { t } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState<{ to: string; text: string; at: string }[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    const time = new Date().toISOString();
    if (selectedUser === 'all') {
      // simulate sending to all users
      randomUsers.forEach((u) => {
        setSent((s) => [{ to: u.name, text: message, at: time }, ...s]);
      });
    } else {
      const user = randomUsers.find(u => u.id === selectedUser);
      if (user) setSent((s) => [{ to: user.name, text: message, at: time }, ...s]);
    }
    setMessage('');
  };

  return (
    <SidebarLayout pageTitle={t('messages') || 'Messages'}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {randomUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Textarea value={message} onChange={(e) => setMessage((e.target as HTMLTextAreaElement).value)} placeholder="Write your message..." />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => { setMessage(''); }}>Clear</Button>
                <Button onClick={handleSend}>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sent.length === 0 && <div className="text-sm text-muted-foreground">No messages sent yet.</div>}
              {sent.map((s, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">To: {s.to}</div>
                    <div className="text-xs text-muted-foreground">{new Date(s.at).toLocaleString()}</div>
                  </div>
                  <div className="mt-2">{s.text}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default Messages;
