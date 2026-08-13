'use client';

import type { Skill } from '@/lib/api';
import { StackFeatureSection } from '@/components/ui/stack-feature-section';

interface Props {
  skills: Skill[];
}

export function Skills({ skills }: Props) {
  if (skills.length === 0) return (
    <section id="skills" className="bg-gradient-to-b from-white via-sky-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 lg:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Skills & Expertise</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-light p-12 text-center">
            <p className="font-medium text-slate-900 dark:text-white">Belum ada data skill</p>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Tambahkan skill melalui admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section id="skills" className="bg-gradient-to-b from-white via-sky-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 lg:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StackFeatureSection
          skills={skills}
          title="Skills & Expertise"
          subtitle="Technologies and tools I use to build modern applications"
        />
      </div>
    </section>
  );
}
