'use client';

import { useEffect, useState } from 'react';
import { educationApi } from '@/lib/api';
import type { Education } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2 } from 'lucide-react';

export function EducationManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await educationApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this protofolio_education entry?')) return;
    try {
      await educationApi.delete(id);
      toast({ title: 'Education deleted' }); load();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold">Education</h2><p className="text-sm text-muted-foreground">Manage your protofolio_educational background.</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
      </div>

      {showForm && <EducationForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No protofolio_education entries yet. Click "Add Education" to get started.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex-1">
                <h3 className="font-semibold">{item.degree}</h3>
                <p className="text-sm text-muted-foreground">{item.institution}{item.field ? ` · ${item.field}` : ''}</p>
                {(item.start_date || item.end_date) && <p className="text-xs text-muted-foreground mt-1">{item.start_date ?? ''} — {item.end_date ?? 'Present'}</p>}
                {item.description && <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{item.description}</p>}
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

function EducationForm({ item, onClose, onSaved }: { item: Education | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ institution: item?.institution ?? '', degree: item?.degree ?? '', field: item?.field ?? '', start_date: item?.start_date ?? '', end_date: item?.end_date ?? '', description: item?.description ?? '', sort_order: item?.sort_order ?? 0 });

  async function handleSave() {
    setSaving(true);
    try {
      if (item) { await educationApi.update(item.id, form); }
      else { await educationApi.create(form as any); }
      toast({ title: 'Education saved' }); onSaved();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{item ? 'Edit Education' : 'New Education'}</h3><Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Institution</Label><Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} /></div>
        <div className="space-y-2"><Label>Degree</Label><Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
        <div className="space-y-2"><Label>Field of Study</Label><Input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} /></div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
        <div className="space-y-2"><Label>Start Date</Label><Input type="month" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
        <div className="space-y-2"><Label>End Date</Label><Input type="month" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="flex gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={onClose}>Cancel</Button></div>
    </div>
  );
}
