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
    <section id="achievements" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />
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
              <Trophy className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="font-medium text-slate-900 dark:text-white">No achievements yet</p>
              <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Add achievements via the admin panel.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((item, i) => (
                <div
                  key={item.id}
                  className="glass-card-light p-5 flex items-start gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-primary/10 dark:bg-primary/15 flex items-center justify-center shrink-0 text-2xl">
                      {item.icon ?? <Trophy className="h-7 w-7 text-primary" />}
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
