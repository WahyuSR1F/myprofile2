'use client';

import { messagesApi } from '@/lib/api';
import type { Message } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, MailOpen, Trash2, Loader2, Reply } from 'lucide-react';
import { useState } from 'react';

interface Props {
  messages: Message[];
  onUpdate: () => void;
}

export function MessageInbox({ messages, onUpdate }: Props) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function markRead(msg: Message) {
    if (msg.is_read) { setSelected(msg); return; }
    try {
      await messagesApi.markRead(msg.id);
      onUpdate(); setSelected({ ...msg, is_read: true });
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return;
    setDeleting(id);
    try {
      await messagesApi.delete(id);
      toast({ title: 'Message deleted' }); setSelected(null); onUpdate();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setDeleting(null); }
  }

  return (
    <div className="space-y-6">
      <div><h2 className="font-display text-2xl font-bold">Messages</h2><p className="text-sm text-muted-foreground">Messages from your contact form ({messages.filter((m) => !m.is_read).length} unread).</p></div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No messages yet.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            {messages.map((msg) => (
              <button key={msg.id} onClick={() => markRead(msg)} className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${selected?.id === msg.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}>
                {msg.is_read ? <MailOpen className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" /> : <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2"><span className={`truncate ${msg.is_read ? 'font-medium' : 'font-bold'}`}>{msg.name}</span><span className="text-xs text-muted-foreground shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span></div>
                  <p className="text-sm text-muted-foreground truncate">{msg.subject ?? msg.message}</p>
                </div>
                {!msg.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-2" />}
              </button>
            ))}
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            {selected ? (
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-semibold">{selected.subject ?? '(No subject)'}</h3><p className="text-sm text-muted-foreground">From {selected.name}</p><a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">{selected.email}</a></div>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(selected.id)}>{deleting === selected.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}</Button>
                </div>
                <div className="border-t border-border pt-4"><p className="text-sm whitespace-pre-wrap">{selected.message}</p></div>
                <div className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</div>
                <Button asChild variant="outline" className="w-full"><a href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? ''}`}><Reply className="mr-2 h-4 w-4" /> Reply via Email</a></Button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">Select a message to read it.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
