"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type SkillItem = {
  name: string;
  Icon?: React.ElementType;
  color?: string;
};

type LogoCloudProps = {
  items: SkillItem[];
  className?: string;
};

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const gridItem: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function LogoCloud({ items, className }: LogoCloudProps) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border border-border/50 rounded-xl overflow-hidden",
        className
      )}
      variants={gridContainer}
      initial="hidden"
      animate="show"
    >
      {items.map((item) => (
        <motion.div
          key={item.name}
          variants={gridItem}
          className={cn(
            "flex flex-col items-center justify-center gap-2",
            "px-4 py-6 md:py-8",
            "border-b border-r border-border/40 last:border-r-0",
            "[&:nth-child(4n)]:border-r-0",
            "[&:nth-last-child(-n+4)]:border-b-0",
            "bg-background hover:bg-secondary/40 transition-colors duration-300",
            "cursor-default group"
          )}
          whileHover={{ scale: 1.03, zIndex: 10 }}
          transition={{ duration: 0.2 }}
        >
          {item.Icon && (
            <item.Icon
              className="h-5 w-5 md:h-6 md:w-6 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
              style={{ color: item.color }}
            />
          )}
          <span className="text-xs font-medium text-muted-foreground text-center leading-tight group-hover:text-foreground transition-colors duration-300">
            {item.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
