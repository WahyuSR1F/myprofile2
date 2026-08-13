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
      const panels = gsap.utils.toArray<HTMLElement>(".about-panel");
      
      gsap.set(panels, { autoAlpha: 0, scale: 0.85, y: 60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Panel 1: Tentang Saya
      tl.to(panels[0], { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(panels[0], { autoAlpha: 0, scale: 1.1, y: -60, duration: 0.5, ease: "power2.in" }, "+=0.8");

      // Panel 2: Ringkasan Profesional
      tl.to(panels[1], { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(panels[1], { autoAlpha: 0, scale: 1.1, y: -60, duration: 0.5, ease: "power2.in" }, "+=0.8");

      // Panel 3: Problem Solver / Inovator / Results-Driven
      tl.to(panels[2], { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(panels[2], { autoAlpha: 0, scale: 1.1, y: -60, duration: 0.5, ease: "power2.in" }, "+=0.8");

      // Panel 4: Kompetensi Utama
      tl.to(panels[3], { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(panels[3], { autoAlpha: 0, scale: 1.1, y: -60, duration: 0.5, ease: "power2.in" }, "+=0.8");

      // Panel 5: Stats Cards
      tl.to(panels[4], { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(panels[4], { autoAlpha: 0, scale: 0.9, y: -40, duration: 0.8, ease: "power2.in" }, "+=1");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="relative w-screen h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90" />

      <div className="blob bg-blue-700 w-[400px] h-[400px] -top-20 -right-20 opacity-10" />
      <div className="blob bg-slate-300 w-[300px] h-[300px] bottom-10 -left-10 opacity-10" style={{ animationDelay: '3s' }} />

      {/* Panel 1: Tentang Saya */}
      <div className="about-panel absolute inset-0 flex items-center justify-center z-10 px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-slate-900 dark:text-white">
            Tentang Saya
          </h2>
          <div className="section-divider-light" />
        </div>
      </div>

      {/* Panel 2: Ringkasan Profesional */}
      <div className="about-panel absolute inset-0 flex items-center justify-center z-10 px-4">
        <div className="glass-card-light p-6 sm:p-10 max-w-4xl w-full">
          <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Ringkasan Profesional
          </h3>
          <div className="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              {profile?.bio || `Profesional multidisiplin dengan latar belakang kuat di bidang 
              kesehatan masyarakat dan pengembangan teknologi. Berpengalaman dalam 
              mengelola program kesehatan berbasis data, memimpin tim lintas sektor, 
              serta membangun solusi digital yang berdampak langsung pada peningkatan 
              kualitas layanan dan efisiensi operasional.`}
            </p>
            <p>
              {profile?.tagline || `Memadukan keahlian di bidang kesehatan dan teknologi untuk 
              menciptakan inovasi yang relevan, terukur, dan berkelanjutan. Terbiasa 
              bekerja dalam lingkungan yang dinamis, berpikir analitis, dan berkomunikasi 
              secara efektif dengan berbagai pemangku kepentingan.`}
            </p>
          </div>
        </div>
      </div>

      {/* Panel 3: Problem Solver / Inovator / Results-Driven */}
      <div className="about-panel absolute inset-0 flex items-center justify-center z-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl w-full">
          {highlights.map((item) => (
            <div key={item.title} className="glass-card-light p-5">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 dark:bg-blue-500/25 flex items-center justify-center mb-3">
                <item.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4: Kompetensi Utama */}
      <div className="about-panel absolute inset-0 flex items-center justify-center z-10 px-4">
        <div className="glass-card-light p-6 sm:p-10 max-w-4xl w-full">
          <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Kompetensi Utama
          </h3>
          <div className="space-y-5">
            {Object.entries(grouped).map(([category, catSkills]) => {
              const Icon = categoryIcons[category] || Code2;
              return (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-500/15 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300 border border-blue-500/25"
                      >
                        {skill.icon && (
                          <img src={skill.icon} alt="" className="h-4 w-4" />
                        )}
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

      {/* Panel 5: Stats Cards */}
      <div className="about-panel absolute inset-0 flex items-center justify-center z-10 px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card-light p-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 dark:bg-blue-500/25 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
