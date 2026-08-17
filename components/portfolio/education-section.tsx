'use client';

import type { Education } from '@/lib/api';
import { useInView } from '@/lib/use-in-view';
import { GraduationCap, Calendar } from 'lucide-react';

interface Props {
  education: Education[];
}

export function EducationSection({ education }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  if (education.length === 0) return (
    <section id="education" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />

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
  );

  return (
    <section id="education" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/images/education/bg-education.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div ref={ref} className={`max-w-3xl mx-auto ${inView ? 'animate-fade-in-up' : 'opacity-0-init'}`}>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Education</h2>
            <div className="section-divider-light" />
          </div>

          <div className="space-y-4">
            {education.map((edu, i) => (
              <div
                key={edu.id}
                className="glass-card-light p-6 flex items-start gap-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{edu.degree}</h3>
                  <p className="text-primary font-medium text-sm">{edu.institution}</p>
                  {edu.field && <p className="text-sm text-slate-600 dark:text-slate-400">{edu.field}</p>}
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <Calendar className="h-3 w-3" />
                    {edu.start_date ?? ''} — {edu.end_date ?? 'Present'}
                  </div>
                  {edu.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{edu.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
