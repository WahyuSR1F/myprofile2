'use client';

import { useState } from 'react';
import { profileApi } from '@/lib/api';
import type { Profile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

interface Props {
  profile: Profile | null;
  onUpdate: () => void;
}

export function ProfileEditor({ profile, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>(
    profile ?? {
      name: 'Wahyu Sahri Rhamadhan',
      title: 'Health Professional',
      tagline: '', bio: '', photo_url: '', email: '', phone: '', location: '',
      website: '', linkedin_url: '', github_url: '', twitter_url: '', instagram_url: '', cv_url: '',
      available_for_work: true,
    }
  );

  async function handleSave() {
    setSaving(true);
    try {
      await profileApi.save({ ...form, id: profile?.id });
      toast({ title: 'Profile saved successfully' });
      onUpdate();
    } catch (e) {
      toast({ title: 'Error saving profile', description: (e as Error).message, variant: 'destructive' });
    } finally { setSaving(false); }
  }

  function set(key: keyof Profile, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information and bio.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="title">Professional Title</Label><Input id="title" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="tagline">Tagline</Label><Input id="tagline" placeholder="Short catchy phrase" value={form.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" rows={6} placeholder="Tell visitors about yourself..." value={form.bio ?? ''} onChange={(e) => set('bio', e.target.value)} /></div>
        <div className="space-y-2"><Label>Photo</Label><ImageUpload value={form.photo_url ?? null} onChange={(url) => set('photo_url', url ?? '')} folder="profile" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="website">Website</Label><Input id="website" value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="linkedin">LinkedIn URL</Label><Input id="linkedin" value={form.linkedin_url ?? ''} onChange={(e) => set('linkedin_url', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="github">GitHub URL</Label><Input id="github" value={form.github_url ?? ''} onChange={(e) => set('github_url', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="twitter">Twitter URL</Label><Input id="twitter" value={form.twitter_url ?? ''} onChange={(e) => set('twitter_url', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="instagram">Instagram URL</Label><Input id="instagram" value={form.instagram_url ?? ''} onChange={(e) => set('instagram_url', e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="cv_url">CV / Resume URL</Label><Input id="cv_url" value={form.cv_url ?? ''} onChange={(e) => set('cv_url', e.target.value)} /></div>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><Label htmlFor="available" className="cursor-pointer">Available for work</Label><p className="text-sm text-muted-foreground">Show an availability badge on your portfolio.</p></div>
          <Switch id="available" checked={form.available_for_work ?? false} onCheckedChange={(v) => set('available_for_work', v)} />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Profile
        </Button>
      </div>
    </div>
  );
}
