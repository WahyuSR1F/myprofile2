"use client";

import { Experience } from "@/lib/supabase";
import { CheckCircle2, MapPin, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { useInView } from "@/lib/use-in-view";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  experiences: Experience[];
}

const experienceImages: Record<string, string> = {
  "tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "startup": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
  "company": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "office": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
  "remote": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
  "default": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
};

function getExperienceImage(exp: Experience): string {
  const text = `${exp.company} ${exp.position}`.toLowerCase();
  for (const [key, url] of Object.entries(experienceImages)) {
    if (text.includes(key)) return url;
  }
  return experienceImages["default"];
}

export function ExperienceSection({ experiences }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full opacity-15 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`max-w-5xl mx-auto ${inView ? "animate-fade-in-up" : "opacity-0-init"}`}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Work Experience</h2>
            <div className="section-divider-light" />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-white/20 to-transparent sm:-translate-x-1/2" />

            {experiences.map((exp, i) => {
              const isExpanded = expandedId === exp.id;
              const imageUrl = getExperienceImage(exp);

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex ${i % 2 === 0 ? "sm:justify-start" : "sm:justify-end"} mb-8`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/25 sm:-translate-x-1/2 mt-6 z-10" />

                  {/* Content: Card + Image */}
                  <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? "sm:mr-8" : "sm:ml-8"}`}>
                    <div className="relative rounded-2xl overflow-hidden glass-card-dark">
                      <div className="flex">
                        {/* Card */}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-white">{exp.position}</h3>
                              <p className="text-[#FA500F] font-medium text-sm">{exp.company}</p>
                            </div>
                            {exp.current && (
                              <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FA500F]/20 text-[#FA500F] border border-[#FA500F]/30">
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
                                  <CheckCircle2 className="h-4 w-4 text-[#FA500F] shrink-0 mt-0.5" />
                                  <span className="text-slate-300">{a}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Image thumbnail */}
                        {!isExpanded && (
                          <button
                            onClick={() => setExpandedId(exp.id)}
                            className="hidden sm:flex w-24 md:w-28 shrink-0 relative group cursor-pointer"
                            aria-label={`View ${exp.company} image`}
                          >
                            <img
                              src={imageUrl}
                              alt={`${exp.company} experience`}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-[#FA500F]/90 rounded-full p-2">
                                <ChevronRight className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Expanded image - slides right */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0 z-10"
                          >
                            <div className="relative w-full h-full">
                              <img
                                src={imageUrl}
                                alt={`${exp.company} experience`}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-[#0a0a0c]/20 to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                              {/* Close button */}
                              <button
                                onClick={() => setExpandedId(null)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-[#FA500F]/80 text-white rounded-full p-2 transition-colors"
                                aria-label="Close"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>

                              {/* Info overlay */}
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="absolute bottom-0 left-0 right-0 p-6"
                              >
                                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 max-w-md">
                                  <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                                  <p className="text-[#FA500F] font-medium text-sm">{exp.position}</p>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
