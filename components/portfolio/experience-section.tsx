"use client";

import { Experience } from "@/lib/supabase";
import { CheckCircle2, MapPin, Calendar } from "lucide-react";
import { useInView } from "@/lib/use-in-view";

interface Props {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Noise grain */}
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`max-w-4xl mx-auto ${inView ? "animate-fade-in-up" : "opacity-0-init"}`}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Work Experience</h2>
            <div className="section-divider-light" />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-white/20 to-transparent sm:-translate-x-1/2" />

            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                className={`relative flex ${i % 2 === 0 ? "sm:justify-start" : "sm:justify-end"} mb-8 animate-fade-in-up`}
                style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/25 sm:-translate-x-1/2 mt-6" />

                <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] glass-card-dark p-5 ${i % 2 === 0 ? "sm:mr-8" : "sm:ml-8"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{exp.position}</h3>
                      <p className="text-primary font-medium text-sm">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {exp.start_date} — {exp.current ? "Present" : exp.end_date ?? "Present"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {exp.location}
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-sm text-slate-300 mb-3">{exp.description}</p>
                  )}

                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1.5">
                      {exp.achievements.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-slate-300">{a}</span>
                        </li>
                      ))}
                    </ul>
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

