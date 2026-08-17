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
    <footer className="bg-background py-10 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <HeartPulse className="h-5 w-5 text-primary" />
            <span>{name}</span>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {year} {name}. All rights reserved.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <ArrowUp className="h-4 w-4" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
