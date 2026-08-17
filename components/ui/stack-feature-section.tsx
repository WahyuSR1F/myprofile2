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
  const orbitGap = 6;

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

  return (
    <section className="relative max-w-6xl mx-auto my-6 overflow-visible">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[20rem] lg:min-h-[24rem] overflow-visible">
        {/* Left 1/4: Orbit animation */}
        <div className="relative w-full lg:w-1/4 min-h-[16rem] lg:min-h-[24rem] flex items-center justify-center">
          <div className="relative w-[20rem] h-[20rem] flex items-center justify-center">
            {/* Center Circle */}
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 shadow-lg flex items-center justify-center z-10">
              <FaReact className="w-6 h-6 text-primary" />
            </div>

            {/* Generate Orbits */}
            {[...Array(orbitCount)].map((_, orbitIdx) => {
              const size = `${8 + orbitGap * (orbitIdx + 1)}rem`;
              const orbitSkills = enrichedSkills.slice(
                orbitIdx * iconsPerOrbit,
                orbitIdx * iconsPerOrbit + iconsPerOrbit
              );
              const angleStep = (2 * Math.PI) / Math.max(orbitSkills.length, 1);

              return (
                <div
                  key={orbitIdx}
                  className="absolute rounded-full border-2 border-dotted border-border"
                  style={{
                    width: size,
                    height: size,
                    animation: `orbit-spin ${14 + orbitIdx * 5}s linear infinite`,
                  }}
                >
                  {orbitSkills.map((skill, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <motion.div
                        key={skill.id}
                        className="absolute bg-card rounded-full p-1.5 shadow-md border border-border"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                          animation: `orbit-counter-spin ${14 + orbitIdx * 5}s linear infinite`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: orbitIdx * 0.2 + iconIdx * 0.05, duration: 0.4 }}
                        title={skill.name}
                      >
                        <skill.Icon
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          style={{ color: skill.color }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 3/4: Skill badges */}
        <div className="w-full lg:w-3/4 p-5 sm:p-6 lg:pl-24">
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
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {categories.map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat);
              return (
                <motion.div key={cat} variants={item} className="p-3">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    {cat}
                  </h3>
                  <div className="space-y-2.5">
                    {catSkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">{skill.name}</span>
                          <span className="text-[10px] text-muted-foreground">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
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
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
