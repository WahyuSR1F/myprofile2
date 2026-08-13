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
    <section id="education" className="bg-gradient-to-b from-white via-sky-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Accent blobs */}
      <div className="blob bg-blue-800 w-[350px] h-[350px] -top-10 -right-10 opacity-20" />
      <div className="blob bg-slate-700 w-[250px] h-[250px] bottom-10 left-10 opacity-20" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Education</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-light p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 text-blue-300" />
            <p className="font-medium text-slate-900 dark:text-white">Belum ada data pendidikan</p>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Tambahkan riwayat pendidikan melalui admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section id="education" className="bg-gradient-to-b from-white via-sky-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Accent blobs */}
      <div className="blob bg-blue-800 w-[350px] h-[350px] -top-10 -right-10 opacity-20" />
      <div className="blob bg-slate-700 w-[250px] h-[250px] bottom-10 left-10 opacity-20" style={{ animationDelay: '2s' }} />
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
                className="glass-card-light p-6 flex items-start gap-4 animate-fade-in-up hover:scale-[1.01] transition-all duration-300"
                style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 dark:bg-blue-500/25 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{edu.degree}</h3>
                  <p className="text-blue-700 dark:text-blue-400 font-medium text-sm">{edu.institution}</p>
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
