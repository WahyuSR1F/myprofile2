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
    <section id="experience" className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 lg:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Accent blobs */}
      <div className="blob bg-blue-600 w-[350px] h-[350px] -top-10 right-10 opacity-20" />
      <div className="blob bg-slate-700 w-[250px] h-[250px] bottom-10 left-0 opacity-20" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`max-w-4xl mx-auto ${inView ? "animate-fade-in-up" : "opacity-0-init"}`}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Work Experience</h2>
            <div className="section-divider-light" />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-slate-300 to-transparent sm:-translate-x-1/2" />

            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                className={`relative flex ${i % 2 === 0 ? "sm:justify-start" : "sm:justify-end"} mb-8 animate-fade-in-up`}
                style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/25 sm:-translate-x-1/2 mt-6" />

                <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] glass-card-dark p-5 ${i % 2 === 0 ? "sm:mr-8" : "sm:ml-8"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{exp.position}</h3>
                      <p className="text-blue-300 font-medium text-sm">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
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
                          <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
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

