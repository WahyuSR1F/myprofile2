"use client";

import type { ReactNode } from "react";
import { Profile } from "@/lib/supabase";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { Linkedin, Github, Twitter, Instagram } from "lucide-react";

interface Props {
  profile: Profile | null;
}

const SHOWCASE_IMAGES = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=60",
];

export function Hero({ profile }: Props) {
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
      socials={socials}
      availableForWork={profile?.available_for_work}
      avatar={profile?.photo_url?.trim() ? profile.photo_url : "/images/profile/profile.png"}
      images={SHOWCASE_IMAGES}
    />
  );
}
