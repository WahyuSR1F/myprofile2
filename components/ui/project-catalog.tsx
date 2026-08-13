"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Target, Lightbulb, CheckCircle, ArrowRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectCatalogProps {
  project: Project;
  onClose: () => void;
}

export function ProjectCatalog({ project, onClose }: ProjectCatalogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Default catalog data based on project
  const catalogData = {
    targetCustomers: [
      "Bisnis UMKM yang ingin go digital",
      "Perusahaan startup yang membutuhkan solusi teknologi",
      "Organisasi yang ingin mengoptimalkan proses operasional",
    ],
    solutions: [
      "Pengembangan aplikasi web modern dan responsif",
      "Integrasi sistem dan API untuk otomasi proses",
      "Desain UI/UX yang intuitif dan user-friendly",
    ],
    benefits: [
      "Peningkatan efisiensi operasional hingga 60%",
      "Pengurangan biaya operasional secara signifikan",
      "Meningkatkan pengalaman pelanggan dan retensi",
    ],
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Overlay animation
      gsap.fromTo(overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, ease: "power2.out" }
      );

      // Content animation
      gsap.fromTo(contentRef.current,
        { autoAlpha: 0, scale: 0.9, y: 50 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)", delay: 0.2 }
      );

      // Stagger animations for sections
      gsap.fromTo(".catalog-section",
        { autoAlpha: 0, x: -30 },
        { 
          autoAlpha: 1, x: 0, 
          stagger: 0.15, 
          duration: 0.6, 
          ease: "power3.out",
          delay: 0.4
        }
      );

      // CTA animation
      gsap.fromTo(".catalog-cta",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.8 }
      );

    }, overlayRef);

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });
    tl.to(contentRef.current, { autoAlpha: 0, scale: 0.9, y: 30, duration: 0.3, ease: "power2.in" })
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, "-=0.1");
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 rounded-t-3xl">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {project.title}
            </h2>
            {project.featured && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                ★ Featured Project
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Project Image */}
          {project.image_url && (
            <div className="catalog-section overflow-hidden rounded-2xl">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="catalog-section">
            <h3 className="font-display text-lg font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-full" />
              Deskripsi Aplikasi
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.long_description || project.description || "Deskripsi proyek ini akan segera tersedia."}
            </p>
          </div>

          {/* Tech Stack */}
          {project.tech_stack.length > 0 && (
            <div className="catalog-section">
              <h3 className="font-display text-lg font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 rounded-full" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target Customers */}
          <div className="catalog-section">
            <h3 className="font-display text-lg font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Target Pelanggan
            </h3>
            <ul className="space-y-2">
              {catalogData.targetCustomers.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="catalog-section">
            <h3 className="font-display text-lg font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Solusi yang Ditawarkan
            </h3>
            <ul className="space-y-2">
              {catalogData.solutions.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <ArrowRight className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="catalog-section">
            <h3 className="font-display text-lg font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Benefit
            </h3>
            <ul className="space-y-2">
              {catalogData.benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <div className="catalog-cta bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-center">
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Tertarik dengan solusi ini?
            </h3>
            <p className="text-blue-100 mb-4">
              Aplikasi bisnismu bisa jadi lebih baik. Saya siap membantu!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20solusi%20{project.title}"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Konfirmasi Sekarang
                <ArrowRight className="h-4 w-4" />
              </a>
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Lihat Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
