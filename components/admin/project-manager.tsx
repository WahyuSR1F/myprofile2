'use client';

import React, { useEffect, useState } from 'react';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, X, Loader2, Star, Target, Lightbulb, TrendingUp } from 'lucide-react';

export function ProjectManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await projectsApi.list();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    try {
      await projectsApi.delete(id);
      toast({ title: 'Project deleted' }); load();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-2xl font-bold">Projects</h2><p className="text-sm text-muted-foreground">Manage your portfolio protofolio_projects.</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
      </div>

      {showForm && <ProjectForm item={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">No protofolio_projects yet. Click "Add Project" to get started.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {item.image_url && <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover" />}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">{item.featured && <Star className="h-4 w-4 fill-warning text-warning" />}<h3 className="font-semibold">{item.title}</h3></div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(item); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
                {item.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1">{item.tech_stack.slice(0, 4).map((t) => <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{t}</span>)}</div>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: `Target: ${item.target_pelanggan?.length ?? 0}`, ok: (item.target_pelanggan?.length ?? 0) > 0 },
                    { label: `Solusi: ${item.solusi?.length ?? 0}`, ok: (item.solusi?.length ?? 0) > 0 },
                    { label: `Benefit: ${item.benefit?.length ?? 0}`, ok: (item.benefit?.length ?? 0) > 0 },
                  ].map(({ label, ok }) => (
                    <span key={label} className={`rounded-full px-2 py-0.5 text-xs border ${ok ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border'}`}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Editable list helper (Target Pelanggan / Solusi / Benefit) ─────────────
function EditableListField({
  label,
  icon: Icon,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <Label className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {label}</Label>
      <p className="text-xs text-muted-foreground">Satu item per baris. Item kosong akan diabaikan.</p>
      <Textarea
        rows={Math.max(3, items.length + 1)}
        value={items.join('\n')}
        placeholder={placeholder}
        onChange={(e) => {
          const lines = e.target.value.split('\n').map((l) => l.trimEnd());
          // Keep trailing empty lines while typing (don't fight the user), filter on save
          onChange(lines);
          }}
      />
    </div>
  );
}

function ProjectForm({ item, onClose, onSaved }: { item: Project | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: item?.title ?? '', description: item?.description ?? '', long_description: item?.long_description ?? '',
    image_url: item?.image_url ?? '', tech_stack: (item?.tech_stack ?? []).join(', '), project_url: item?.project_url ?? '',
    github_url: item?.github_url ?? '', featured: item?.featured ?? false, sort_order: item?.sort_order ?? 0,
    target_pelanggan: item?.target_pelanggan ?? [] as string[],
    solusi: item?.solusi ?? [] as string[],
    benefit: item?.benefit ?? [] as string[],
  });

  function normalizeList(list: string[]): string[] {
    return list.map((l) => l.trim()).filter(Boolean);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      tech_stack: form.tech_stack.split(',').map((t) => t.trim()).filter(Boolean),
      target_pelanggan: normalizeList(form.target_pelanggan),
      solusi: normalizeList(form.solusi),
      benefit: normalizeList(form.benefit),
    };
    try {
      if (item) { await projectsApi.update(item.id, payload); }
      else { await projectsApi.create(payload as any); }
      toast({ title: 'Project saved' }); onSaved();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{item ? 'Edit Project' : 'New Project'}</h3><Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Short Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Long Description</Label><Textarea rows={4} value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Image</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url ?? '' })} folder="projects" /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Tech Stack (comma-separated)</Label><Input value={form.tech_stack} placeholder="React, Next.js, Supabase" onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} /></div>
        <div className="space-y-2"><Label>Project URL</Label><Input value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} /></div>
        <div className="space-y-2"><Label>GitHub URL</Label><Input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} /></div>
        <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
        <div className="flex items-center gap-3 pt-6"><Switch id="featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label htmlFor="featured">Featured project</Label></div>
      </div>

      {/* Isi Katalog (Target Pelanggan / Solusi / Benefit) — per project */}
      <div className="space-y-4 rounded-xl border border-border bg-secondary/30 p-4">
        <div>
          <h4 className="font-display font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Isi Katalog Project</h4>
          <p className="text-xs text-muted-foreground mt-1">Konten yang muncul di katalog (modal detail) project. Jika kosong, otomatis pakai data dari tab Layanan.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          <EditableListField
            label="Target Pelanggan"
            icon={Target}
            placeholder={'Bisnis UMKM yang ingin go digital\nPerusahaan startup yang membutuhkan solusi teknologi\nOrganisasi yang ingin mengoptimalkan proses operasional'}
            items={form.target_pelanggan}
            onChange={(items) => setForm({ ...form, target_pelanggan: items })}
          />
          <EditableListField
            label="Solusi yang Ditawarkan"
            icon={Lightbulb}
            placeholder={'Pengembangan aplikasi web modern dan responsif\nIntegrasi sistem dan API untuk otomasi proses\nDesain UI/UX yang intuitif dan user-friendly'}
            items={form.solusi}
            onChange={(items) => setForm({ ...form, solusi: items })}
          />
          <EditableListField
            label="Benefit"
            icon={TrendingUp}
            placeholder={'Peningkatan efisiensi operasional hingga 60%\nPengurangan biaya operasional secara signifikan\nMeningkatkan pengalaman pelanggan dan retensi'}
            items={form.benefit}
            onChange={(items) => setForm({ ...form, benefit: items })}
          />
        </div>
      </div>
      <div className="flex gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button><Button variant="outline" onClick={onClose}>Cancel</Button></div>
    </div>
  );
}
