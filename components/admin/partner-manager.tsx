'use client';

import { useEffect, useState } from 'react';
import { partnersApi } from '@/lib/api';
import type { Partner } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2, Handshake } from 'lucide-react';

export function PartnerManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await partnersApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this partner?')) return;
    try {
      await partnersApi.delete(id);
      toast({ title: 'Partner deleted' }); load();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Partners / Kerja Sama</h2>
          <p className="text-sm text-muted-foreground">Kelola logo perusahaan yang pernah bekerja sama. Logo ini tampil di marquee bawah hero.</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Partner</Button>
      </div>

      {showForm && <PartnerForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
          <Handshake className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          Belum ada partner. Klik &quot;Add Partner&quot; untuk menambahkan logo perusahaan kerja sama.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              {item.logo_url ? (
                <img src={item.logo_url} alt={item.name} className="h-16 w-16 rounded-lg border border-border bg-white object-contain p-1.5" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Handshake className="h-8 w-8 text-primary/50" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <span>Sort: {item.sort_order}</span>
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Website</a>}
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

function PartnerForm({ item, onClose, onSaved }: { item: Partner | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: item?.name ?? '',
    logo_url: item?.logo_url ?? null,
    url: item?.url ?? '',
    sort_order: item?.sort_order ?? 0,
  });

  async function handleSave() {
    if (!form.name.trim()) { toast({ title: 'Nama perusahaan wajib diisi', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      if (item) { await partnersApi.update(item.id, form); }
      else { await partnersApi.create(form as any); }
      toast({ title: 'Partner saved' }); onSaved();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{item ? 'Edit Partner' : 'New Partner'}</h3>
        <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      <div className="space-y-2">
        <Label>Logo Perusahaan</Label>
        <ImageUpload value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} folder="partners" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Nama Perusahaan *</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. PT Telkom Indonesia" />
        </div>
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Website URL (opsional)</Label>
          <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}
