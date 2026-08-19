'use client';

import { useEffect, useState } from 'react';
import { certificatesApi } from '@/lib/api';
import type { Certificate } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2, Award } from 'lucide-react';

export function CertificateManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await certificatesApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this certificate?')) return;
    try {
      await certificatesApi.delete(id);
      toast({ title: 'Certificate deleted' }); load();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold">Certificates</h2><p className="text-sm text-muted-foreground">Manage your certifications and credentials.</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Certificate</Button>
      </div>

      {showForm && <CertificateForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No certificates yet. Click &quot;Add Certificate&quot; to get started.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary/50" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <span>{item.issuer}</span>
                  {item.date && <span>{item.date}</span>}
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a>}
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

function CertificateForm({ item, onClose, onSaved }: { item: Certificate | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: item?.title ?? '',
    issuer: item?.issuer ?? '',
    date: item?.date ?? '',
    url: item?.url ?? '',
    image_url: item?.image_url ?? null,
    sort_order: item?.sort_order ?? 0,
  });

  async function handleSave() {
    if (!form.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    if (!form.issuer.trim()) { toast({ title: 'Issuer is required', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      if (item) { await certificatesApi.update(item.id, form); }
      else { await certificatesApi.create(form as any); }
      toast({ title: 'Certificate saved' }); onSaved();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{item ? 'Edit Certificate' : 'New Certificate'}</h3>
        <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      <div className="space-y-2">
        <Label>Certificate Image</Label>
        <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="certificates" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. AWS Solutions Architect" />
        </div>
        <div className="space-y-2">
          <Label>Issuer *</Label>
          <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="e.g. Amazon Web Services" />
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Certificate URL</Label>
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
