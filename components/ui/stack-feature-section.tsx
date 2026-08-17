"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaReact, FaAws, FaDocker, FaNodeJs, FaGithub,
  FaPython, FaJava, FaGitAlt, FaLinux, FaDatabase,
  FaFire, FaCog, FaServer, FaCode
} from "react-icons/fa";
import {
  SiNextdotjs, SiVercel, SiRedux, SiTypescript, SiTailwindcss,
  SiPostgresql, SiMongodb, SiGraphql, SiKubernetes, SiTerraform,
  SiJavascript, SiDrizzle, SiSqlite
} from "react-icons/si";
import { type Skill } from "@/lib/api";
import { LogoCloud } from "@/components/ui/logo-cloud-2";

const skillIconMap: Record<string, { Icon: React.ElementType; color: string }> = {
  "react":          { Icon: FaReact, color: "#61DAFB" },
  "next.js":        { Icon: SiNextdotjs, color: "#ffffff" },
  "nextjs":         { Icon: SiNextdotjs, color: "#ffffff" },
  "typescript":     { Icon: SiTypescript, color: "#3178C6" },
  "javascript":     { Icon: SiJavascript, color: "#F7DF1E" },
  "tailwind css":   { Icon: SiTailwindcss, color: "#06B6D4" },
  "tailwind":       { Icon: SiTailwindcss, color: "#06B6D4" },
  "node.js":        { Icon: FaNodeJs, color: "#339933" },
  "nodejs":         { Icon: FaNodeJs, color: "#339933" },
  "python":         { Icon: FaPython, color: "#3776AB" },
  "java":           { Icon: FaJava, color: "#ED8B00" },
  "aws":            { Icon: FaAws, color: "#FF9900" },
  "docker":         { Icon: FaDocker, color: "#2496ED" },
  "github":         { Icon: FaGithub, color: "#ffffff" },
  "git":            { Icon: FaGitAlt, color: "#F05032" },
  "postgresql":     { Icon: SiPostgresql, color: "#4169E1" },
  "mongodb":        { Icon: SiMongodb, color: "#47A248" },
  "graphql":        { Icon: SiGraphql, color: "#E10098" },
  "kubernetes":     { Icon: SiKubernetes, color: "#326CE5" },
  "terraform":      { Icon: SiTerraform, color: "#7B42BC" },
  "redux":          { Icon: SiRedux, color: "#764ABC" },
  "vercel":         { Icon: SiVercel, color: "#ffffff" },
  "linux":          { Icon: FaLinux, color: "#FCC624" },
  "firebase":       { Icon: FaFire, color: "#FFCA28" },
  "drizzle":        { Icon: SiDrizzle, color: "#C5F74F" },
  "sqlite":         { Icon: SiSqlite, color: "#003B57" },
  "express.js":     { Icon: FaServer, color: "#ffffff" },
  "express":        { Icon: FaServer, color: "#ffffff" },
  "supabase":       { Icon: FaDatabase, color: "#3ECF8E" },
  "html":           { Icon: FaCode, color: "#E34F26" },
  "css":            { Icon: FaCode, color: "#1572B6" },
  "default":        { Icon: FaCog, color: "#6B7280" },
};

function getIconForSkill(skillName: string) {
  const lower = skillName.toLowerCase();
  for (const [key, value] of Object.entries(skillIconMap)) {
    if (lower.includes(key)) return value;
  }
  return skillIconMap["default"];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

interface StackFeatureSectionProps {
  skills: Skill[];
  title?: string;
  subtitle?: string;
}

export function StackFeatureSection({
  skills,
  title = "My Tech Stack",
  subtitle = "Technologies and tools I use to build modern applications",
}: StackFeatureSectionProps) {
  const orbitCount = 3;

  const enrichedSkills = useMemo(
    () =>
      skills.map((s) => ({
        ...s,
        ...getIconForSkill(s.name),
      })),
    [skills]
  );

  const iconsPerOrbit = Math.ceil(enrichedSkills.length / orbitCount);
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  // Solar system config: orbit radii, speeds, and colors
  const orbits = [
    { radius: 4.5,  speed: 12, color: "rgba(250, 80, 15, 0.35)", glowColor: "rgba(250, 80, 15, 0.15)" },   // Mercury-like
    { radius: 7,    speed: 18, color: "rgba(59, 130, 246, 0.3)", glowColor: "rgba(59, 130, 246, 0.12)" },  // Earth-like
    { radius: 9.5,  speed: 26, color: "rgba(168, 85, 247, 0.25)", glowColor: "rgba(168, 85, 247, 0.1)" },  // Jupiter-like
  ];

  return (
    <section className="relative max-w-6xl mx-auto my-6">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[20rem] lg:min-h-[24rem] overflow-visible">
        {/* Left: Solar system orbit animation */}
        <div className="relative w-full lg:w-1/3 min-h-[16rem] lg:min-h-[24rem] flex items-center justify-center overflow-hidden">
          <div className="relative w-[14rem] h-[14rem] sm:w-[16rem] sm:h-[16rem] lg:w-[18rem] lg:h-[18rem] flex items-center justify-center">

            {/* ── Sun (center) ── */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="absolute w-10 h-10 rounded-full bg-primary/30 blur-md" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_rgba(250,80,15,0.5)] flex items-center justify-center z-10">
                <FaReact className="w-6 h-6 text-white drop-shadow-md" />
              </div>
            </div>

            {/* ── Orbit rings + planets ── */}
            {orbits.map((orbit, orbitIdx) => {
              const diameter = orbit.radius * 2;
              const orbitSkills = enrichedSkills.slice(
                orbitIdx * iconsPerOrbit,
                orbitIdx * iconsPerOrbit + iconsPerOrbit
              );
              const angleStep = (2 * Math.PI) / Math.max(orbitSkills.length, 1);

              return (
                /* Wrapper: centers the orbit at the middle of the container */
                <div
                  key={orbitIdx}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${diameter}rem`,
                    height: `${diameter}rem`,
                  }}
                >
                  {/* Rotating track — planets are children so they orbit with it */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `1.5px solid ${orbit.color}`,
                      boxShadow: `0 0 8px ${orbit.glowColor}, inset 0 0 8px ${orbit.glowColor}`,
                      animation: `orbit-spin ${orbit.speed}s linear infinite`,
                    }}
                  >
                    {/* Planets on the ring edge — counter-spin keeps them upright */}
                    {orbitSkills.map((skill, iconIdx) => {
                      const angle = iconIdx * angleStep;
                      const x = 50 + 50 * Math.cos(angle);
                      const y = 50 + 50 * Math.sin(angle);

                      return (
                        <motion.div
                          key={skill.id}
                          className="absolute bg-card/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-border/50 z-10"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: "translate(-50%, -50%)",
                            animation: `orbit-counter-spin ${orbit.speed}s linear infinite`,
                            boxShadow: `0 0 6px ${orbit.glowColor}`,
                          }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: orbitIdx * 0.3 + iconIdx * 0.08, duration: 0.5 }}
                          title={skill.name}
                        >
                          <skill.Icon
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            style={{ color: skill.color }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Skill LogoCloud grid */}
        <div className="w-full lg:w-2/3 min-w-0 p-5 sm:p-6 lg:pl-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LogoCloud
              items={enrichedSkills.map((s) => ({
                name: s.name,
                Icon: s.Icon,
                color: s.color,
              }))}
            />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-counter-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes sun-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(250, 80, 15, 0.5), 0 0 40px rgba(250, 80, 15, 0.2); }
          50% { box-shadow: 0 0 30px rgba(250, 80, 15, 0.7), 0 0 60px rgba(250, 80, 15, 0.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
