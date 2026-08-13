'use client';

import { useState } from 'react';
import { settingsApi } from '@/lib/api';
import type { Setting } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  settings: Setting[];
  onUpdate: () => void;
}

export function SettingsManager({ settings, onUpdate }: Props) {
  const { toast } = useToast();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const otherSettings = settings.filter((s) => !s.key.startsWith('show_'));

  async function toggleSetting(key: string, value: boolean) {
    try {
      await settingsApi.updateOne(key, String(value));
      toast({ title: 'Setting updated' }); onUpdate();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  async function addSetting() {
    if (!newKey.trim()) return;
    try {
      await settingsApi.updateOne(newKey.trim(), newValue.trim());
      toast({ title: 'Setting added' }); setNewKey(''); setNewValue(''); onUpdate();
    } catch (e) { toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' }); }
  }

  async function deleteSetting(key: string) {
    if (!confirm('Delete this setting?')) return;
    // For now just set to empty — API doesn't expose delete for settings
    try {
      await settingsApi.updateOne(key, '');
      toast({ title: 'Setting cleared' }); onUpdate();
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  }

  const sections = [
    { key: 'show_about', label: 'About Section' },
    { key: 'show_experiences', label: 'Experience Section' },
    { key: 'show_skills', label: 'Skills Section' },
    { key: 'show_projects', label: 'Projects Section' },
    { key: 'show_education', label: 'Education Section' },
    { key: 'show_contact', label: 'Contact Section' },
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="font-display text-2xl font-bold">Settings</h2><p className="text-sm text-muted-foreground">Control which sections appear on your portfolio.</p></div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Section Visibility</h3>
        {sections.map((s) => {
          const setting = settings.find((x) => x.key === s.key);
          const checked = setting ? setting.value === 'true' : true;
          return (
            <div key={s.key} className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor={s.key} className="cursor-pointer">{s.label}</Label>
              <Switch id={s.key} checked={checked} onCheckedChange={(v) => toggleSetting(s.key, v)} />
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Custom Settings</h3>
        {otherSettings.length > 0 && (
          <div className="space-y-2">
            {otherSettings.map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-lg border border-border p-3">
                <div className="flex-1"><span className="text-sm font-medium">{s.key}</span><p className="text-xs text-muted-foreground">{s.value ?? '(empty)'}</p></div>
                <Button size="icon" variant="ghost" onClick={() => deleteSetting(s.key)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
          <Input placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <Button onClick={addSetting}><Plus className="mr-2 h-4 w-4" /> Add</Button>
        </div>
      </div>
    </div>
  );
}
