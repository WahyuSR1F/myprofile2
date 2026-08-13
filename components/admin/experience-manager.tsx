'use client';

import { useEffect, useState } from 'react';
import { experiencesApi } from '@/lib/api';
import type { Experience } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2, GripVertical } from 'lucide-react';

export function ExperienceManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await experiencesApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this experience?')) return;
    try {
      await experiencesApi.delete(id);
      toast({ title: 'Experience deleted' }); load();
    } catch { toast({ title: 'Error deleting', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold">Work Experience</h2><p className="text-sm text-muted-foreground">Manage your professional experience timeline.</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
      </div>

      {showForm && <ExperienceForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No protofolio_experiences yet. Click "Add Experience" to get started.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <GripVertical className="mt-1 h-5 w-5 shrink-0 text-muted-foreground/40" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-semibold">{item.position}</h3>{item.current && <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">Current</span>}</div>
                <p className="text-sm text-muted-foreground">{item.company}{item.location ? ` · ${item.location}` : ''}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.start_date} — {item.current ? 'Present' : item.end_date ?? 'Present'}</p>
                {item.achievements.length > 0 && <p className="text-sm mt-2 text-muted-foreground">{item.achievements.length} achievements</p>}
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

function ExperienceForm({ item, onClose, onSaved }: { item: Experience | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: item?.company ?? '', position: item?.position ?? '', start_date: item?.start_date ?? '', end_date: item?.end_date ?? '',
    current: item?.current ?? false, description: item?.description ?? '', achievements: (item?.achievements ?? []).join('\n'),
    location: item?.location ?? '', sort_order: item?.sort_order ?? 0,
  });

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, achievements: form.achievements.split('\n').map((a) => a.trim()).filter(Boolean) };
    try {
      if (item) { await experiencesApi.update(item.id, payload); }
      else { await experiencesApi.create(payload as any); }
      toast({ title: 'Experience saved' }); onSaved();
    } catch (e) { toast({ title: 'Error saving', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{item ? 'Edit Experience' : 'New Experience'}</h3><Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
        <div className="space-y-2"><Label>Position</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
        <div className="space-y-2"><Label>Start Date</Label><Input type="month" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
        <div className="space-y-2"><Label>End Date</Label><Input type="month" value={form.end_date} disabled={form.current} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
        <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="space-y-2"><Label>Achievements (one per line)</Label><Textarea rows={5} value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} /></div>
      <div className="flex items-center gap-3"><Switch id="current" checked={form.current} onCheckedChange={(v) => setForm({ ...form, current: v })} /><Label htmlFor="current">I currently work here</Label></div>
      <div className="flex gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={onClose}>Cancel</Button></div>
    </div>
  );
}
