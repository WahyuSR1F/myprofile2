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
import { OrbitRotation } from "@/components/ui/orbit-rotation";

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
  const enrichedSkills = useMemo(
    () =>
      skills.map((s) => ({
        ...s,
        ...getIconForSkill(s.name),
      })),
    [skills]
  );

  const orbitIcons = useMemo(
    () =>
      enrichedSkills.map((s) => ({
        Icon: s.Icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>,
        name: s.name,
        color: s.color,
      })),
    [enrichedSkills]
  );

  return (
    <section className="relative max-w-6xl mx-auto my-6 overflow-visible">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[28rem] lg:min-h-[32rem] overflow-visible">
        {/* Left: Orbit rotation animation */}
        <div className="relative w-full lg:w-1/3 min-h-[28rem] lg:min-h-[32rem] flex items-center justify-center overflow-visible">
          <OrbitRotation
            icons={orbitIcons}
            orbitCount={3}
            orbitGap={6}
            centerIcon={{ Icon: FaReact, name: "React", color: "#61DAFB" }}
            size="md"
            className="w-full h-full"
          />
        </div>

        {/* Right: Skill LogoCloud grid */}
        <div className="w-full lg:w-2/3 min-w-0 p-5 sm:p-6 lg:pl-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
              Skills & <span className="text-[#FA500F]">Expertise</span>
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LogoCloud items={enrichedSkills} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
