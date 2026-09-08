"use client";

import { Experience } from "@/lib/supabase";
import { CheckCircle2, MapPin, Calendar, ChevronRight, ChevronLeft, Briefcase } from "lucide-react";
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
  if (exp.image_url) return exp.image_url;
  const text = `${exp.company} ${exp.position}`.toLowerCase();
  for (const [key, url] of Object.entries(experienceImages)) {
    if (text.includes(key)) return url;
  }
  return experienceImages["default"];
}

export function ExperienceSection({ experiences }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="experience" className="relative scroll-mt-20 bg-[#0a0a0c] py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Abstract animated orbs - positioned INSIDE, no negative overflow */}
      <div className="absolute top-10 left-10 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 right-10 h-[350px] w-[350px] rounded-full opacity-15 blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute bottom-10 left-1/3 h-[250px] w-[250px] rounded-full opacity-10 blur-[90px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, hsl(var(--accent) / 0.2) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-white">Work Experience</h2>
            <div className="section-divider-light" />
          </motion.div>

          {/* ── Empty state ── */}
          {experiences.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-16 sm:py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Briefcase className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold text-white/80 mb-2">Belum Ada Pengalaman</h3>
              <p className="text-sm text-slate-400 text-center max-w-sm">
                Pengalaman kerja akan muncul di sini setelah ditambahkan melalui panel admin.
              </p>
            </motion.div>
          )}

          {/* ── Timeline ── */}
          {experiences.length > 0 && (
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
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex ${i % 2 === 0 ? "sm:justify-start" : "sm:justify-end"} mb-8 last:mb-0`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/25 sm:-translate-x-1/2 mt-6 z-10" />

                  {/* Content: Card + Image */}
                  <div className={`ml-12 sm:ml-0 w-full sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? "sm:mr-8" : "sm:ml-8"}`}>
                    <div className="relative rounded-2xl overflow-hidden glass-card-dark">
                      <div className="flex">
                        {/* Card */}
                        <div className="flex-1 p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-base sm:text-lg text-white">{exp.position}</h3>
                              <p className="text-[#FA500F] font-medium text-xs sm:text-sm">{exp.company}</p>
                            </div>
                            {exp.current && (
                              <span className="shrink-0 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-[#FA500F]/20 text-[#FA500F] border border-[#FA500F]/30">
                                Current
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 shrink-0" /> {exp.start_date} — {exp.current ? "Present" : exp.end_date ?? "Present"}
                            </span>
                            {exp.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 shrink-0" /> {exp.location}
                              </span>
                            )}
                          </div>

                          {exp.description && (
                            <p className="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3 leading-relaxed">{exp.description}</p>
                          )}

                          {exp.achievements.length > 0 && (
                            <ul className="space-y-1 sm:space-y-1.5">
                              {exp.achievements.map((a, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FA500F] shrink-0 mt-0.5" />
                                  <span className="text-slate-300 leading-relaxed">{a}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Image thumbnail - visible on mobile as small strip, larger on desktop */}
                        {!isExpanded && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                            className="w-16 sm:w-24 md:w-28 shrink-0 relative group cursor-pointer"
                            aria-label={`View ${exp.company} image`}
                          >
                            <img
                              src={imageUrl}
                              alt={`${exp.company} experience`}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-[#FA500F]/90 rounded-full p-1.5 sm:p-2">
                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Expanded image - slides right to fill card */}
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
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 hover:bg-[#FA500F]/80 text-white rounded-full p-1.5 sm:p-2 transition-colors"
                                aria-label="Close"
                              >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>

                              {/* Info overlay */}
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
                              >
                                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 sm:p-4 max-w-md">
                                  <h3 className="text-base sm:text-xl font-bold text-white">{exp.company}</h3>
                                  <p className="text-[#FA500F] font-medium text-xs sm:text-sm">{exp.position}</p>
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
          )}
        </div>
      </div>
    </section>
  );
}
