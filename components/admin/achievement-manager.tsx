'use client';

import { useEffect, useState } from 'react';
import { achievementsApi } from '@/lib/api';
import type { Achievement } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2 } from 'lucide-react';

export function AchievementManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await achievementsApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this achievement?')) return;
    try {
      await achievementsApi.delete(id);
      toast({ title: 'Achievement deleted' }); load();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold">Achievements</h2><p className="text-sm text-muted-foreground">Manage your achievements and awards.</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Achievement</Button>
      </div>

      {showForm && <AchievementForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No achievements yet. Click "Add Achievement" to get started.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              {item.image_url && <img src={item.image_url} alt={item.title} className="h-16 w-16 rounded-lg object-cover" />}
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                {item.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                  {item.date && <span>{item.date}</span>}
                  {item.icon && <span>Icon: {item.icon}</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(item); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementForm({ item, onClose, onSaved }: { item: Achievement | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: item?.title ?? '', description: item?.description ?? '', date: item?.date ?? '', icon: item?.icon ?? '', image_url: item?.image_url ?? null, sort_order: item?.sort_order ?? 0 });

  async function handleSave() {
    setSaving(true);
    try {
      if (item) { await achievementsApi.update(item.id, form); }
      else { await achievementsApi.create(form as any); }
      toast({ title: 'Achievement saved' }); onSaved();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{item ? 'Edit Achievement' : 'New Achievement'}</h3><Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></div>
      <div className="space-y-2"><Label>Image</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="achievements" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
        <div className="space-y-2"><Label>Date</Label><Input type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        <div className="space-y-2"><Label>Icon</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="lucide icon name" /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="flex gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={onClose}>Cancel</Button></div>
    </div>
  );
}
