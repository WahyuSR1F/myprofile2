'use client';

import type { Achievement } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trophy, Calendar, Star, Award, Medal, Target, Zap, Crown } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  star: Star,
  award: Award,
  medal: Medal,
  target: Target,
  zap: Zap,
  crown: Crown,
};

function getIcon(iconName: string | null) {
  if (!iconName) return Trophy;
  return iconMap[iconName.toLowerCase()] || Trophy;
}

interface Props {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: Props) {
  if (achievements.length === 0) return (
    <section id="achievements" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Achievements</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-light p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-3 text-primary/50" />
            <p className="font-medium text-slate-900 dark:text-white">No achievements yet</p>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Add achievements via the admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  );

  const first = achievements[0];
  const rest = achievements.slice(1);

  return (
    <section id="achievements" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-16 md:py-32">
      {/* Abstract animated orbs — inside, no negative positions */}
      <div className="absolute top-10 left-10 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 right-10 h-[350px] w-[350px] rounded-full opacity-15 blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16 relative z-10">
        {/* Headline */}
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-4xl font-medium lg:text-5xl text-slate-900 dark:text-white">
            Milestones that define my <span className="font-semibold text-primary">journey</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Every achievement represents a challenge conquered, a skill mastered, and a step forward in my professional growth.
          </p>
        </div>

        {/* Card Grid - responsive */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          {/* First achievement - large card with image */}
          <Card className="grid grid-rows-[auto_auto_1fr] gap-4 sm:col-span-2 sm:p-4 md:p-6 lg:row-span-2 bg-white dark:bg-white/5 border-border/50 overflow-hidden">
            {first.image_url ? (
              <div className="relative h-40 sm:h-56 overflow-hidden rounded-t-lg -mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
                <img
                  src={first.image_url}
                  alt={first.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            ) : (
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center">
                  {(() => {
                    const Icon = getIcon(first.icon);
                    return <Icon className="h-6 w-6 text-primary" />;
                  })()}
                </div>
              </CardHeader>
            )}
            <CardContent className={first.image_url ? "pt-2" : ""}>
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{first.title}</h3>
                {first.description && (
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{first.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  {first.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {first.date}
                    </span>
                  )}
                </div>
              </blockquote>
            </CardContent>
          </Card>

          {/* Rest achievements - smaller cards with images */}
          {rest.map((item) => (
            <Card key={item.id} className="bg-white dark:bg-white/5 border-border/50 overflow-hidden">
              {item.image_url && (
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              )}
              <CardContent className={item.image_url ? "pt-3" : "pt-6"}>
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-4">
                  <div>
                    {!item.image_url && (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/15 flex items-center justify-center mb-3">
                        {(() => {
                          const Icon = getIcon(item.icon);
                          return <Icon className="h-5 w-5 text-primary" />;
                        })()}
                      </div>
                    )}
                    <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {item.date}
                      </span>
                    )}
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
