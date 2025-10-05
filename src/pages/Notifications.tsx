import React, { useEffect, useMemo, useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Bell, Archive, Check, Trash2 } from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived?: boolean;
};

const STORAGE_KEY = 'trademate.notifications.v1';

function sampleNotifications(): Notification[] {
  const now = Date.now();
  return [
    { id: '1', title: 'Low stock alert', message: 'Rice (1kg) is below threshold', createdAt: new Date(now - 1000 * 60 * 60).toISOString(), read: false },
    { id: '2', title: 'Payment received', message: '₹2,500 received from राज पटेल', createdAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(), read: true },
    { id: '3', title: 'Backup completed', message: 'Daily backup finished successfully', createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(), read: false },
  ];
}

const Notifications: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<Notification[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Notification[];
    } catch (e) {
      // ignore
    }
    return sampleNotifications();
  });

  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const visible = useMemo(() => items.filter(i => {
    if (filter === 'all') return !i.archived;
    if (filter === 'unread') return !i.archived && !i.read;
    return i.archived;
  }), [items, filter]);

  const markRead = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
  const markUnread = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, read: false } : i));
  const archive = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, archived: true } : i));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearAll = () => setItems([]);

  return (
    <SidebarLayout pageTitle={t('nav.notifications')}> 
      <div className="space-y-6">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-primary rounded-2xl p-4 sm:p-6 text-white animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Notifications</h2>
              <p className="text-sm text-white/90">Manage and act on your notifications</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => setFilter('all')}>All</Button>
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => setFilter('unread')}>Unread</Button>
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => setFilter('archived')}>Archived</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
                <div>
                  <CardTitle>Inbox</CardTitle>
                  <CardDescription>Recent notifications</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setItems(prev => prev.map(i => ({ ...i, read: true })))}>Mark all read</Button>
                  <Button variant="outline" onClick={() => setItems(prev => prev.map(i => ({ ...i, archived: true })))}>Archive all</Button>
                  <Button variant="destructive" onClick={() => setItems([])}>Clear all</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[240px] sm:min-h-[420px]">
              {visible.length === 0 ? (
                <div className="text-sm text-muted-foreground">No notifications</div>
              ) : (
                <div className="space-y-3">
                  {visible.map(n => (
                    <div key={n.id} className={`p-4 rounded-lg border border-border bg-background animate-slide-in-right ${n.read ? 'opacity-70' : ''}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-medium">{n.title}</div>
                            <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{n.message}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 sm:mt-0">
                          {n.read ? (
                            <Button size="sm" variant="ghost" onClick={() => markUnread(n.id)}><Check className="h-4 w-4" /> Mark Unread</Button>
                          ) : (
                            <Button size="sm" variant="secondary" onClick={() => markRead(n.id)}><Check className="h-4 w-4" /> Mark Read</Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => archive(n.id)}><Archive className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => remove(n.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Archived / Extras could go here if needed */}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Notifications;
