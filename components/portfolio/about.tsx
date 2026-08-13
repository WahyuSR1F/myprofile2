'use client';

import { Profile, Skill } from '@/lib/supabase';
import { CinematicAbout } from '@/components/ui/cinematic-about';

interface Props {
  profile: Profile | null;
  skills: Skill[];
}

export function About({ profile, skills }: Props) {
  return <CinematicAbout profile={profile} skills={skills} />;
}
