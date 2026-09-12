"use client";

import { Service } from "@/lib/supabase";
import { Users, Wrench, TrendingUp, CheckCircle2, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  services: Service[];
}

const GROUP_META: Record<
  string,
  { label: string; icon: typeof Users; accent: string; bg: string; border: string }
> = {
  target: {
    label: "Target Pelanggan",
    icon: Users,
    accent: "text-[#FA500F]",
    bg: "bg-[#FA500F]/10",
    border: "border-[#FA500F]/30",
  },
  solusi: {
    label: "Solusi yang Ditawarkan",
    icon: Wrench,
    accent: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  benefit: {
    label: "Benefit",
    icon: TrendingUp,
    accent: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/30",
  },
};

const GROUP_ORDER = ["target", "solusi", "benefit"] as const;

export function ServicesSection({ services }: Props) {
  // Group services, keep admin's sort_order within each group
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    meta: GROUP_META[g],
    items: services.filter((s) => s.group === g),
  })).filter((g) => g.items.length > 0);

  if (services.length === 0) return null;

  return (
    <section id="services" className="relative scroll-mt-20 bg-[#0a0a0c] py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Abstract animated orbs */}
      <div className="absolute top-10 right-10 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)", animation: "abstract-drift-2 20s ease-in-out infinite" }} />
      <div className="absolute bottom-10 left-10 h-[350px] w-[350px] rounded-full opacity-15 blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 70%)", animation: "abstract-drift-1 24s ease-in-out infinite" }} />
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-4">
              <Layers className="h-3.5 w-3.5" /> Layanan Kami
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-white">Apa yang Kami Tawarkan</h2>
            <div className="section-divider-light" />
          </motion.div>

          {/* Groups */}
          <div className="space-y-12 sm:space-y-16">
            {grouped.map((g, gi) => {
              const Icon = g.meta.icon;
              return (
                <div key={g.group}>
                  {/* Group header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <div className={`w-10 h-10 rounded-xl ${g.meta.bg} border ${g.meta.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-5 w-5 ${g.meta.accent}`} />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">{g.meta.label}</h3>
                    <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
                  </motion.div>

                  {/* Cards */}
                  <div className={`grid gap-4 sm:gap-5 ${g.items.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : g.items.length === 2 ? "sm:grid-cols-2" : "max-w-xl"}`}>
                    {g.items.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                        className="glass-card-dark rounded-2xl p-5 sm:p-6 flex flex-col gap-2 hover:border-primary/40 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          {s.image_url ? (
                            <img src={s.image_url} alt={s.title} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <div className={`w-9 h-9 rounded-lg ${g.meta.bg} flex items-center justify-center shrink-0`}>
                              <CheckCircle2 className={`h-4.5 w-4.5 ${g.meta.accent}`} />
                            </div>
                          )}
                          <h4 className="font-semibold text-sm sm:text-base text-white leading-snug">{s.title}</h4>
                        </div>
                        {s.description && (
                          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">{s.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
