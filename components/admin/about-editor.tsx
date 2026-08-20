'use client';

import { useEffect, useState } from 'react';
import { profileApi } from '@/lib/api';
import type { Profile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Plus, Trash2, Award, Target, Lightbulb, CheckCircle, Briefcase, Users, GraduationCap } from 'lucide-react';

interface Highlight { icon: string; title: string; desc: string; }
interface Stat { label: string; value: string; }

const HIGHLIGHT_ICONS: Record<string, typeof Target> = { Target, Lightbulb, CheckCircle, Award, Briefcase, Users, GraduationCap };
const ICON_OPTIONS = Object.keys(HIGHLIGHT_ICONS);
const DEFAULT_HIGHLIGHTS: Highlight[] = [
  { icon: 'Target', title: 'Problem Solver', desc: 'Mengidentifikasi dan menyelesaikan tantangan teknis & non-teknis dengan solusi inovatif.' },
  { icon: 'Lightbulb', title: 'Inovator', desc: 'Menerapkan teknologi terkini untuk mengoptimalkan proses kerja dan produktivitas.' },
  { icon: 'CheckCircle', title: 'Results-Driven', desc: 'Berorientasi pada hasil dengan pencapaian target dan peningkatan performa konsisten.' },
];
const DEFAULT_STATS: Stat[] = [
  { label: 'Pengalaman', value: '3+ Tahun' },
  { label: 'Sertifikasi', value: '5+' },
  { label: 'Tim Dipimpin', value: '10+' },
  { label: 'Pendidikan', value: 'S.K.M' },
];

function parseJson(raw: string | null, fallback: Highlight[]): Highlight[] {
  if (!raw) return fallback;
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : fallback; } catch { return fallback; }
}
function parseStatsJson(raw: string | null, fallback: Stat[]): Stat[] {
  if (!raw) return fallback;
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : fallback; } catch { return fallback; }
}

interface Props { profile: Profile | null; onUpdate: () => void; }

export function AboutEditor({ profile, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [motivasi, setMotivasi] = useState('');
  const [keteranganPengalaman, setKeteranganPengalaman] = useState('');
  const [highlights, setHighlights] = useState<Highlight[]>(DEFAULT_HIGHLIGHTS);
  const [stats, setStats] = useState<Stat[]>(DEFAULT_STATS);

  useEffect(() => {
    if (profile) {
      setMotivasi(profile.motivasi ?? '');
      setKeteranganPengalaman(profile.keterangan_pengalaman ?? '');
      setHighlights(parseJson(profile.about_highlights, DEFAULT_HIGHLIGHTS));
      setStats(parseStatsJson(profile.about_stats, DEFAULT_STATS));
    }
  }, [profile]);

  function updateHighlight(i: number, key: keyof Highlight, value: string) {
    setHighlights((prev) => prev.map((h, idx) => (idx === i ? { ...h, [key]: value } : h)));
  }
  function addHighlight() { setHighlights((prev) => [...prev, { icon: 'Target', title: '', desc: '' }]); }
  function removeHighlight(i: number) { setHighlights((prev) => prev.filter((_, idx) => idx !== i)); }
  function updateStat(i: number, key: keyof Stat, value: string) {
    setStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  }
  function addStat() { setStats((prev) => [...prev, { label: '', value: '' }]); }
  function removeStat(i: number) { setStats((prev) => prev.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    if (!profile?.id) { toast({ title: 'No profile found', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      await profileApi.save({ id: profile.id, motivasi, keterangan_pengalaman: keteranganPengalaman, about_highlights: JSON.stringify(highlights), about_stats: JSON.stringify(stats) });
      toast({ title: 'About section saved successfully' });
      onUpdate();
    } catch (e) { toast({ title: 'Error saving', description: (e as Error).message, variant: 'destructive' }); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Tentang Saya - About Section</h2>
        <p className="text-sm text-muted-foreground">Edit motivasi, keterangan pengalaman, highlight cards, dan statistik di bagian Tentang Saya.</p>
        <p className="text-xs text-muted-foreground mt-1"><strong>Kompetensi Utama</strong> diatur melalui menu <strong>Skills</strong>.</p>
      </div>

      {/* Motivasi */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> Motivasi</h3>
        <p className="text-sm text-muted-foreground">Teks motivasi yang ditampilkan di bagian expand tentang saya.</p>
        <div className="space-y-2">
          <Label htmlFor="motivasi">Teks Motivasi</Label>
          <Textarea id="motivasi" rows={4} placeholder="Contoh: Memadukan keahlian di bidang kesehatan dan teknologi." value={motivasi} onChange={(e) => setMotivasi(e.target.value)} />
        </div>
      </div>

      {/* Keterangan Pengalaman */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Keterangan Pengalaman</h3>
        <p className="text-sm text-muted-foreground">Deskripsi pengalaman profesional.</p>
        <div className="space-y-2">
          <Label htmlFor="keterangan">Keterangan Pengalaman</Label>
          <Textarea id="keterangan" rows={4} placeholder="Ceritakan pengalaman profesional Anda..." value={keteranganPengalaman} onChange={(e) => setKeteranganPengalaman(e.target.value)} />
        </div>
      </div>

      {/* Highlight Cards */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Highlight Cards</h3>
          <Button size="sm" variant="outline" onClick={addHighlight}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <p className="text-sm text-muted-foreground">Kartu-kartu unggulan di bagian tentang saya.</p>
        <div className="space-y-4">
          {highlights.map((h, i) => (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Card #{i + 1}</span>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-8 w-8 p-0" onClick={() => removeHighlight(i)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2"><Label>Icon</Label>
                  <select value={h.icon} onChange={(e) => updateHighlight(i, 'icon', e.target.value)} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                    {ICON_OPTIONS.map((name) => (<option key={name} value={name}>{name}</option>))}
                  </select>
                </div>
                <div className="space-y-2"><Label>Title</Label><Input value={h.title} onChange={(e) => updateHighlight(i, 'title', e.target.value)} placeholder="Problem Solver" /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={2} value={h.desc} onChange={(e) => updateHighlight(i, 'desc', e.target.value)} placeholder="Deskripsi singkat..." /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Statistik</h3>
          <Button size="sm" variant="outline" onClick={addStat}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <p className="text-sm text-muted-foreground">Angka statistik di bagian tentang saya.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((s, i) => (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Stat #{i + 1}</span>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-8 w-8 p-0" onClick={() => removeStat(i)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-2"><Label>Label</Label><Input value={s.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Pengalaman" /></div>
              <div className="space-y-2"><Label>Value</Label><Input value={s.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="3+ Tahun" /></div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save About Section
      </Button>
    </div>
  );
}
