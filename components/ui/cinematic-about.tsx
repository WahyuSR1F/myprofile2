"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Profile, Skill } from "@/lib/supabase";
import { Award, Briefcase, GraduationCap, Users, Target, Lightbulb, CheckCircle, Code2, Database, Shield, Globe, Stethoscope, HeartPulse } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CinematicAboutProps {
  profile: Profile | null;
  skills: Skill[];
}

export function CinematicAbout({ profile, skills }: CinematicAboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const highlights = [
    { icon: Target, title: 'Problem Solver', desc: 'Mengidentifikasi dan menyelesaikan tantangan teknis & non-teknis dengan solusi inovatif.' },
    { icon: Lightbulb, title: 'Inovator', desc: 'Menerapkan teknologi terkini untuk mengoptimalkan proses kerja dan produktivitas.' },
    { icon: CheckCircle, title: 'Results-Driven', desc: 'Berorientasi pada hasil dengan pencapaian target dan peningkatan performa konsisten.' },
  ];

  const stats = [
    { icon: Briefcase, label: 'Pengalaman', value: '3+ Tahun' },
    { icon: Award, label: 'Sertifikasi', value: '5+' },
    { icon: Users, label: 'Tim Dipimpin', value: '10+' },
    { icon: GraduationCap, label: 'Pendidikan', value: 'S.K.M' },
  ];

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const categoryIcons: Record<string, typeof Code2> = {
    'Frontend': Code2, 'Backend': Database, 'Database': Database,
    'DevOps': Globe, 'Security': Shield, 'Kesehatan': HeartPulse,
    'Kesehatan Masyarakat': Stethoscope,
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Scene refs ──
      const sceneSplit = gsap.utils.toArray<HTMLElement>(".about-scene-split");
      const sceneExpand = gsap.utils.toArray<HTMLElement>(".about-scene-expand");
      const sceneCards = gsap.utils.toArray<HTMLElement>(".about-scene-cards");
      const sceneSkills = gsap.utils.toArray<HTMLElement>(".about-scene-skills");
      const sceneStats = gsap.utils.toArray<HTMLElement>(".about-scene-stats");
      const cardItems = gsap.utils.toArray<HTMLElement>(".about-card-item");
      const statItems = gsap.utils.toArray<HTMLElement>(".about-stat-item");

      // ── Initial states ──
      // Scene 1: Split — visible
      gsap.set(sceneSplit, { visibility: "visible", autoAlpha: 1 });
      // Scene 2: Expand — hidden + invisible
      gsap.set(sceneExpand, { visibility: "hidden", autoAlpha: 0, scale: 0.85, y: 60 });
      // Scene 3: Cards — hidden + invisible
      gsap.set(sceneCards, { visibility: "hidden", autoAlpha: 0 });
      gsap.set(cardItems, { autoAlpha: 0, y: 50, scale: 0.9 });
      // Scene 4: Skills — hidden + invisible
      gsap.set(sceneSkills, { visibility: "hidden", autoAlpha: 0, x: 120 });
      // Scene 5: Stats — hidden + invisible
      gsap.set(sceneStats, { visibility: "hidden", autoAlpha: 0, scale: 0.85, y: 40 });
      gsap.set(statItems, { autoAlpha: 0, y: 30 });

      // ── Master Timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // ═══════════════════════════════════════
      // SCENE 1 → 2: Split layout exits, expand enters
      // ═══════════════════════════════════════
      // Split exits first (fully)
      tl.to(sceneSplit, {
        autoAlpha: 0, duration: 0.8, ease: "power3.in",
      }, 0)
      .set(sceneSplit, { visibility: "hidden" }, 0.8)
      // Then expand enters
      .set(sceneExpand, { visibility: "visible" }, 0.8)
      .to(sceneExpand, {
        autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: "power2.out",
      }, 0.8);

      // ═══════════════════════════════════════
      // SCENE 2 → 3: Expand exits, cards enter
      // ═══════════════════════════════════════
      // Expand exits first (fully)
      tl.to(sceneExpand, {
        autoAlpha: 0, y: -60, duration: 0.8, ease: "power2.in",
      }, 2.2)
      .set(sceneExpand, { visibility: "hidden" }, 3)
      // Then cards enter
      .set(sceneCards, { visibility: "visible" }, 3)
      .to(sceneCards, {
        autoAlpha: 1, duration: 0.01,
      }, 3)
      // Cards stagger in like puzzle pieces
      cardItems.forEach((card, i) => {
        tl.to(card, {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        }, 3.1 + i * 0.25);
      });

      // ═══════════════════════════════════════
      // SCENE 3 → 4: Cards exit, skills enter
      // ═══════════════════════════════════════
      // Cards exit first (fully)
      tl.to(cardItems, {
        autoAlpha: 0, y: -50, scale: 1.06,
        duration: 0.6, ease: "power2.in",
        stagger: 0.05,
      }, 4.2)
      .to(sceneCards, {
        autoAlpha: 0, duration: 0.01,
      }, 4.8)
      .set(sceneCards, { visibility: "hidden" }, 4.81)
      // Then skills enter
      .set(sceneSkills, { visibility: "visible" }, 4.81)
      .to(sceneSkills, {
        autoAlpha: 1, x: 0, duration: 1, ease: "power3.out",
      }, 4.81);

      // ═══════════════════════════════════════
      // SCENE 4 → 5: Skills exit, stats enter
      // ═══════════════════════════════════════
      // Skills exit first (fully)
      tl.to(sceneSkills, {
        autoAlpha: 0, x: -100, duration: 0.8, ease: "power2.in",
      }, 6)
      .set(sceneSkills, { visibility: "hidden" }, 6.8)
      // Then stats enter
      .set(sceneStats, { visibility: "visible" }, 6.8)
      .to(sceneStats, {
        autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out",
      }, 6.8);

      // Stat items stagger in
      statItems.forEach((item, i) => {
        tl.to(item, {
          autoAlpha: 1, y: 0,
          duration: 0.4, ease: "back.out(1.3)",
        }, 7.2 + i * 0.15);
      });

    }, containerRef);

    return () => ctx.revert();
  }, [skills]);

  return (
    <section id="about" ref={containerRef} className="relative w-full h-screen overflow-hidden scroll-mt-20 bg-[#faf9f6] dark:bg-[#0a0a0c]">
      {/* ── Abstract animated background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c]" />
        <div
          className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 -left-32 h-[400px] w-[400px] rounded-full opacity-25 blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.45), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full opacity-20 blur-[90px]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-pulse 10s ease-in-out infinite, abstract-drift-3 28s ease-in-out infinite" }}
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.03]" />
      </div>
      <div className="absolute inset-0 grid-pattern pointer-events-none z-[1] opacity-40" />

      {/* ═══════════════════════════════════════════════════
          SCENE 1: Split Layout (Mistral-style)
          ═══════════════════════════════════════════════════ */}
      {/* Left half — big heading */}
      <div className="about-scene-split absolute inset-0 z-10 w-1/2 flex items-center justify-center px-6 lg:px-12 pointer-events-none">
        <div className="text-center md:text-left">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            Tentang
            <br />
            Saya
          </h2>
          <div className="section-divider-light mt-4" />
        </div>
      </div>
      {/* Right half — bio teaser */}
      <div className="about-scene-split absolute inset-0 z-10 w-1/2 flex items-center justify-center px-6 lg:px-12 pointer-events-none">
        <div className="max-w-md">
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            {profile?.bio?.slice(0, 140) || 'Profesional multidisiplin dengan latar belakang kuat di bidang kesehatan masyarakat dan pengembangan teknologi.'}
          </p>
          <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
            <span className="animate-bounce">↓</span>
            <span>Scroll to explore</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SCENE 2: Expanded center text
          ═══════════════════════════════════════════════════ */}
      <div className="about-scene-expand absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
        <div className="text-center max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="h-8 w-8 text-primary" />
            <Lightbulb className="h-8 w-8 text-primary" />
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            {profile?.bio?.slice(0, 160) || 'Profesional multidisiplin dengan latar belakang kuat di bidang kesehatan masyarakat dan pengembangan teknologi.'}
          </h3>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {profile?.tagline || 'Memadukan keahlian di bidang kesehatan dan teknologi untuk menciptakan inovasi yang relevan.'}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SCENE 3: Highlight Cards (puzzle pieces)
          ═══════════════════════════════════════════════════ */}
      <div className="about-scene-cards absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl w-full">
          {highlights.map((item) => (
            <div key={item.title} className="about-card-item glass-card-light p-6 pointer-events-auto">
              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SCENE 4: Kompetensi / Skills
          ═══════════════════════════════════════════════════ */}
      <div className="about-scene-skills absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
        <div className="glass-card-light p-6 sm:p-10 max-w-4xl w-full pointer-events-auto">
          <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <Award className="h-5 w-5 text-primary" />
            Kompetensi Utama
          </h3>
          <div className="space-y-5">
            {Object.entries(grouped).map(([category, catSkills]) => {
              const Icon = categoryIcons[category] || Code2;
              return (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary border border-primary/25"
                      >
                        {skill.icon && <img src={skill.icon} alt="" className="h-4 w-4" />}
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SCENE 5: Stats
          ═══════════════════════════════════════════════════ */}
      <div className="about-scene-stats absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full pointer-events-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="about-stat-item glass-card-light p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
