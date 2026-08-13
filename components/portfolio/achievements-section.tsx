'use client';

import type { Achievement } from '@/lib/api';
import { useInView } from '@/lib/use-in-view';
import { Trophy, Calendar } from 'lucide-react';

interface Props {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="achievements" className="bg-gradient-to-b from-white via-sky-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Accent blobs */}
      <div className="blob bg-blue-800 w-[350px] h-[350px] -top-10 -right-10 opacity-20" />
      <div className="blob bg-slate-700 w-[250px] h-[250px] bottom-10 left-10 opacity-20" style={{ animationDelay: '2s' }} />
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/images/achivement/bg-achievement.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`max-w-4xl mx-auto ${inView ? 'animate-fade-in-up' : 'opacity-0-init'}`}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Achievements</h2>
            <div className="section-divider-light" />
          </div>

          {achievements.length === 0 ? (
            <div className="glass-card-light p-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-blue-300" />
              <p className="font-medium text-slate-900 dark:text-white">Belum ada data pencapaian</p>
              <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Tambahkan pencapaian melalui admin panel.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((item, i) => (
                <div
                  key={item.id}
                  className="glass-card-light p-5 flex items-start gap-4 animate-fade-in-up hover:scale-[1.01] transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-blue-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-blue-500/15 dark:bg-blue-500/25 flex items-center justify-center shrink-0 text-2xl">
                      {item.icon ?? <Trophy className="h-7 w-7 text-blue-600 dark:text-blue-400" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                    )}
                    {item.date && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
