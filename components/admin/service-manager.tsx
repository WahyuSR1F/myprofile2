'use client';

import { useEffect, useState } from 'react';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { Plus, Trash2, Pencil, X, Loader2, GripVertical } from 'lucide-react';

const GROUPS: { value: Service['group']; label: string }[] = [
  { value: 'target', label: 'Target Pelanggan' },
  { value: 'solusi', label: 'Solusi yang Ditawarkan' },
  { value: 'benefit', label: 'Benefit' },
];

const GROUP_LABEL: Record<string, string> = Object.fromEntries(GROUPS.map((g) => [g.value, g.label]));

export function ServiceManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await servicesApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service item?')) return;
    try {
      await servicesApi.delete(id);
      toast({ title: 'Service deleted' }); load();
    } catch { toast({ title: 'Error deleting', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Layanan / Services</h2>
          <p className="text-sm text-muted-foreground">Kelola Target Pelanggan, Solusi yang Ditawarkan, dan Benefit.</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
      </div>

      {showForm && <ServiceForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No services yet. Click &quot;Add Service&quot; to get started.</div>
      ) : (
        GROUPS.map((g) => {
          const groupItems = items.filter((i) => i.group === g.value);
          if (groupItems.length === 0) return null;
          return (
            <div key={g.value} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</h3>
              {groupItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <GripVertical className="mt-1 h-5 w-5 shrink-0 text-muted-foreground/40" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><h4 className="font-semibold">{item.title}</h4></div>
                    {item.description && <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{GROUP_LABEL[item.group]} · Sort: {item.sort_order}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(item); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}

function ServiceForm({ item, onClose, onSaved }: { item: Service | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    group: (item?.group ?? 'solusi') as Service['group'],
    title: item?.title ?? '',
    description: item?.description ?? '',
    icon: item?.icon ?? '',
    image_url: item?.image_url ?? null,
    sort_order: item?.sort_order ?? 0,
  });

  async function handleSave() {
    if (!form.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = { ...form, icon: form.icon || null };
    try {
      if (item) { await servicesApi.update(item.id, payload); }
      else { await servicesApi.create(payload as any); }
      toast({ title: 'Service saved' }); onSaved();
    } catch (e) { toast({ title: 'Error saving', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{item ? 'Edit Service' : 'New Service'}</h3><Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Group</Label>
          <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value as Service['group'] })} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
            {GROUPS.map((g) => (<option key={g.value} value={g.value}>{g.label}</option>))}
          </select>
        </div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="UMKM yang ingin go digital" /></div>
      <div className="space-y-2"><Label>Description (optional)</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat..." /></div>
      <div className="space-y-2"><Label>Image (optional)</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="services" /></div>
      <div className="flex gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={onClose}>Cancel</Button></div>
    </div>
  );
}
