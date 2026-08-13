'use client';

import { useEffect, useState } from 'react';
import { skillsApi } from '@/lib/api';
import type { Skill } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2 } from 'lucide-react';

export function SkillManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await skillsApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return;
    try {
      await skillsApi.delete(id);
      toast({ title: 'Skill deleted' }); load();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold">Skills</h2><p className="text-sm text-muted-foreground">Manage your technical and professional protofolio_skills.</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Skill</Button>
      </div>

      {showForm && <SkillForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No protofolio_skills yet. Click "Add Skill" to get started.</div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">{cat}</h3>
              <div className="space-y-2">
                {items.filter((i) => i.category === cat).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex-1"><span className="font-medium">{item.name}</span><span className="ml-2 text-sm text-muted-foreground">{item.proficiency}%</span></div>
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(item); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillForm({ item, onClose, onSaved }: { item: Skill | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: item?.name ?? '', category: item?.category ?? '', proficiency: item?.proficiency ?? 80, icon: item?.icon ?? '', sort_order: item?.sort_order ?? 0 });

  async function handleSave() {
    setSaving(true);
    try {
      if (item) { await skillsApi.update(item.id, form); }
      else { await skillsApi.create(form as any); }
      toast({ title: 'Skill saved' }); onSaved();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{item ? 'Edit Skill' : 'New Skill'}</h3><Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Skill Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Category</Label><Input value={form.category} placeholder="e.g. Healthcare, Technical, Soft Skills" onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
        <div className="space-y-2"><Label>Proficiency ({form.proficiency}%)</Label><Input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })} /></div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Icon (lucide-react name)</Label><Input value={form.icon ?? ''} placeholder="e.g. heart-pulse" onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
      </div>
      <div className="flex gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={onClose}>Cancel</Button></div>
    </div>
  );
}
