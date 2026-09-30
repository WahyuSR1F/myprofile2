"use client";

import type { ReactNode } from "react";
import { Profile, Partner } from "@/lib/api";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { getCvUrl } from "@/lib/api";
import { Linkedin, Github, Twitter, Instagram } from "lucide-react";

interface Props {
  profile: Profile | null;
  partners?: Partner[];
}

export function Hero({ profile, partners }: Props) {
  const socials: { href: string; label: string; icon: ReactNode }[] = [];
  if (profile?.linkedin_url) {
    socials.push({ href: profile.linkedin_url, label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> });
  }
  if (profile?.github_url) {
    socials.push({ href: profile.github_url, label: "GitHub", icon: <Github className="h-4 w-4" /> });
  }
  if (profile?.twitter_url) {
    socials.push({ href: profile.twitter_url, label: "Twitter", icon: <Twitter className="h-4 w-4" /> });
  }
  if (profile?.instagram_url) {
    socials.push({ href: profile.instagram_url, label: "Instagram", icon: <Instagram className="h-4 w-4" /> });
  }

  const cvUrl = getCvUrl(profile);

  // Marquee images: hanya logo partner kerja sama dari admin.
  // Kalau belum ada partner, marquee disembunyikan (images kosong).
  const marqueeImages = (partners ?? [])
    .map((p) => p.logo_url?.trim())
    .filter((src): src is string => !!src);

  return (
    <MinimalistHero
      tagline={profile?.title ?? "Fullstack Developer & DevOps Engineer"}
      subtitle={profile?.tagline ?? undefined}
      title={profile?.name ?? "Wahyu Sahri Rhamadhan"}
      description={
        profile?.bio?.trim() ||
        "Spesialis dalam membangun aplikasi web modern dan solusi infrastruktur cloud yang scalable."
      }
      ctaText="Let's Work Together"
      secondaryCtaText="View Projects"
      secondaryCtaHref="#projects"
      cvHref={cvUrl}
      cvLabel="Unduh CV"
      socials={socials}
      availableForWork={profile?.available_for_work}
      avatar={profile?.photo_url?.trim() ? profile.photo_url : "/images/profile/profile.png"}
      images={marqueeImages}
      marqueeTitle="Daftar Kerja Sama"
    />
  );
}
