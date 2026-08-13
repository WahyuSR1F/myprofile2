'use client';

import { useEffect, useState } from 'react';
import { coursesApi } from '@/lib/api';
import type { Course } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2 } from 'lucide-react';

export function CourseManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await coursesApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course?')) return;
    try {
      await coursesApi.delete(id);
      toast({ title: 'Course deleted' }); load();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold">Courses</h2><p className="text-sm text-muted-foreground">Manage your courses and certifications.</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Course</Button>
      </div>

      {showForm && <CourseForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No courses yet. Click "Add Course" to get started.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              {item.image_url && <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                  {item.provider && <span>{item.provider}</span>}
                  {item.date && <span>{item.date}</span>}
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View certificate</a>}
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

function CourseForm({ item, onClose, onSaved }: { item: Course | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: item?.name ?? '', provider: item?.provider ?? '', date: item?.date ?? '', url: item?.url ?? '', image_url: item?.image_url ?? null, sort_order: item?.sort_order ?? 0 });

  async function handleSave() {
    setSaving(true);
    try {
      if (item) { await coursesApi.update(item.id, form); }
      else { await coursesApi.create(form as any); }
      toast({ title: 'Course saved' }); onSaved();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{item ? 'Edit Course' : 'New Course'}</h3><Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></div>
      <div className="space-y-2"><Label>Image</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="courses" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
        <div className="space-y-2"><Label>Provider</Label><Input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} /></div>
        <div className="space-y-2"><Label>Date</Label><Input type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Certificate URL</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
      </div>
      <div className="flex gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={onClose}>Cancel</Button></div>
    </div>
  );
}
