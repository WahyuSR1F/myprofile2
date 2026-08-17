'use client'

import type { Skill } from '@/lib/api'
import { StackFeatureSection } from '@/components/ui/stack-feature-section'

interface Props {
  skills: Skill[]
}

export function Skills({ skills }: Props) {
  if (skills.length === 0) return (
    <section id="skills" className="relative scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-10 lg:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Skills & Expertise</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-light p-12 text-center">
            <p className="font-medium text-slate-900 dark:text-white">No skills yet</p>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Add skills via the admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <section id="skills" className="relative scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-10 lg:py-14">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[300px] w-[300px] rounded-full opacity-15 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StackFeatureSection
          skills={skills}
          title="Skills & Expertise"
          subtitle="Technologies and tools I use to build modern, scalable applications — from concept to production."
        />
      </div>
    </section>
  )
}
