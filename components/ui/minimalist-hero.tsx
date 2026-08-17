"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface MinimalistHeroProps {
  tagline: string;
  subtitle?: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  socials?: SocialLink[];
  availableForWork?: boolean;
  images: string[];
  avatar?: string;
  className?: string;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Social icon link — minimalist, subtle
const SocialIcon = ({ href, label, icon }: SocialLink) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
  >
    {icon}
  </a>
);

export const MinimalistHero: React.FC<MinimalistHeroProps> = ({
  tagline,
  subtitle,
  title,
  description,
  ctaText,
  ctaHref = "#contact",
  secondaryCtaText,
  secondaryCtaHref = "#projects",
  socials,
  availableForWork = false,
  images,
  avatar,
  className,
}) => {
  // Split the name so the last word becomes the big overlay line:
  // "Wahyu Sahri" / "Rhamadhan"
  const nameStr = typeof title === "string" ? title : "Wahyu Sahri Rhamadhan";
  const nameParts = nameStr.trim().split(/\s+/).filter(Boolean);
  const overlayPart1 = nameParts.slice(0, -1).join(" ") || nameStr;
  const overlayPart2 = nameParts[nameParts.length - 1] ?? "";
  const locationText = subtitle ?? tagline;

  // ---- Seamless brand marquee ----
  // Track = 2 identical halves, and each half must be wider than the viewport,
  // otherwise the images run out ("kepotong") before the loop restarts.
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackOffset, setTrackOffset] = useState(0);
  const [totalSets, setTotalSets] = useState(4);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || images.length === 0) return;
    const update = () => {
      const setWidth = el.scrollWidth / totalSets; // width of one set of images
      if (setWidth <= 0) return;
      // make sure half the track (totalSets/2 sets) is always >= viewport width
      const halfSets = Math.max(1, Math.ceil(window.innerWidth / setWidth));
      const needed = halfSets * 2;
      setTotalSets((prev) => (prev === needed ? prev : needed));
      // translate exactly one half in pixels so the loop seam is pixel-perfect
      const half = el.scrollWidth / 2;
      if (half > 0) setTrackOffset(half);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [images, totalSets]);

  return (
    <section
      className={cn(
        "relative w-full min-h-screen overflow-hidden bg-background flex flex-col",
        className
      )}
    >
      {/* Subtle decorative background — blurred color wash + grain */}
      <div className="noise-overlay pointer-events-none absolute inset-0 z-[1] opacity-[0.04]" />
      <div className="pointer-events-none absolute z-[1] -top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl motion-safe:animate-float" />
      <div className="pointer-events-none absolute z-[1] top-1/3 -left-40 h-96 w-96 rounded-full bg-accent/15 blur-3xl motion-safe:animate-float" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute z-[1] -bottom-44 right-1/4 h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-3xl motion-safe:animate-float" style={{ animationDelay: "4s" }} />

      {/* Abstract animated background — gradient orbs drifting smoothly */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Base gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        {/* Orb 1 — large primary orange */}
        <div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-40 blur-[100px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.6), transparent 70%)",
            animation: "abstract-drift-1 18s ease-in-out infinite",
          }}
        />
        {/* Orb 2 — accent gold */}
        <div
          className="absolute top-1/4 -right-40 h-[420px] w-[420px] rounded-full opacity-35 blur-[120px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--accent) / 0.55), transparent 70%)",
            animation: "abstract-drift-2 22s ease-in-out infinite",
          }}
        />
        {/* Orb 3 — warm blend bottom-center */}
        <div
          className="absolute -bottom-48 left-1/3 h-[480px] w-[480px] rounded-full opacity-30 blur-[110px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.45) 0%, hsl(var(--accent) / 0.3) 50%, transparent 70%)",
            animation: "abstract-drift-3 20s ease-in-out infinite",
          }}
        />
        {/* Orb 4 — subtle pulse in center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full blur-[90px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--accent) / 0.3), transparent 70%)",
            animation: "abstract-pulse 8s ease-in-out infinite, abstract-drift-1 25s ease-in-out infinite",
          }}
        />
        {/* Noise grain for texture */}
        <div className="noise-overlay absolute inset-0 opacity-[0.03]" />
      </div>
      {/* Readability overlay — stronger on the left (text), lighter on the right */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-background/80 via-background/50 to-background/25" />
      {/* Vignette — soft blurred frame at the edges */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.35) 100%)",
        }}
      />

      {/* Main content — minimalist 3-zone layout */}
      <div className="relative z-10 flex-1 flex items-center pt-24 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center md:grid-cols-3">
            {/* Left: bio + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="z-20 order-2 md:order-1 text-center md:text-left"
            >
              {availableForWork && (
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  Available for work
                </span>
              )}
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground md:mx-0">
                {description}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <a href={ctaHref} className="btn-mistral-primary h-11 px-6 w-full sm:w-auto">
                  {ctaText}
                </a>
                {secondaryCtaText && (
                  <a
                    href={secondaryCtaHref}
                    className="btn-mistral-secondary h-11 px-6 w-full sm:w-auto"
                  >
                    {secondaryCtaText}
                  </a>
                )}
              </div>
            </motion.div>

            {/* Center: gradient circle + portrait */}
            <div className="relative order-1 md:order-2 flex justify-center items-center h-full py-10 md:py-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
                className="absolute z-0 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-primary via-[#FF8204] to-accent shadow-[0_0_80px_rgba(250,80,15,0.35)] md:h-[440px] md:w-[440px] lg:h-[520px] lg:w-[520px]"
              />
              {avatar && (
                <motion.img
                  src={avatar}
                  alt="Profile photo"
                  className="relative z-10 h-auto w-64 object-cover md:w-80 lg:w-[400px] scale-150"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE_OUT, delay: 0.4 }}
                />
              )}
            </div>

            {/* Right: huge overlay text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="z-20 order-3 text-center md:text-left"
            >
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-foreground leading-[0.95]">
                {overlayPart1}
                <br />
                {overlayPart2}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer row — socials + location */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex items-center space-x-4"
          >
            {socials?.map((social) => (
              <SocialIcon key={social.label} href={social.href} label={social.label} icon={social.icon} />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-sm font-medium text-muted-foreground"
          >
            {locationText}
          </motion.div>
        </div>
      </div>

      {/* Bottom brand marquee — always moves right→left, images flush with no gaps */}
      {images.length > 0 && (
        <div className="relative z-[3] w-full border-t border-border/60 bg-card/30 py-6 backdrop-blur-sm">
          <div className="relative overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex w-max items-stretch"
              animate={{
                x: [0, -trackOffset],
                transition: { ease: "linear", duration: 40, repeat: Infinity },
              }}
            >
              {Array.from({ length: totalSets })
                .flatMap(() => images)
                .map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt=""
                    aria-hidden
                    className="h-28 md:h-36 aspect-[3/4] object-cover"
                  />
                ))}
            </motion.div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
};
