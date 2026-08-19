'use client'

import type { Education } from '@/lib/api'
import { ImpactExperience } from '@/components/ui/impact-experience'
import { GraduationCap } from 'lucide-react'

interface Props {
  education: Education[]
}

export function EducationSection({ education }: Props) {
  if (education.length === 0) return (
    <section id="education" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Education</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-light p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 text-primary/50" />
            <p className="font-medium text-slate-900 dark:text-white">No education history yet</p>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Add education via the admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <section id="education" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs — inside, no negative positions */}
      <div className="absolute top-10 left-10 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 right-10 h-[350px] w-[350px] rounded-full opacity-15 blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ImpactExperience
          title="EDUCATION"
          headline="Building a foundation that drives innovation — where academic rigor meets real-world impact."
          items={education}
        />
      </div>
    </section>
  )
}
