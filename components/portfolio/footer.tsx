'use client';

import { Profile } from '@/lib/supabase';
import { HeartPulse, ArrowUp } from 'lucide-react';

interface Props {
  profile: Profile | null;
}

export function Footer({ profile }: Props) {
  const name = profile?.name ?? 'Wahyu Sahri Rhamadhan';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 py-10 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold">
            <HeartPulse className="h-5 w-5 text-blue-400" />
            <span className="text-white">{name}</span>
          </div>

          <p className="text-sm text-white/50">
            &copy; {year} {name}. All rights reserved.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition-colors text-white"
          >
            <ArrowUp className="h-4 w-4" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
