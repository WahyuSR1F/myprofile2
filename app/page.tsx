'use client';

import { useEffect, useState } from 'react';
import {
  profileApi, experiencesApi, skillsApi, projectsApi,
  educationApi, settingsApi, certificatesApi, achievementsApi, coursesApi
} from '@/lib/api';
import type { Profile, Experience, Skill, Project, Education, Setting, Certificate, Achievement, Course } from '@/lib/api';
import { Navbar } from '@/components/portfolio/navbar';
import { Hero } from '@/components/portfolio/hero';
import { About } from '@/components/portfolio/about';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { Skills } from '@/components/portfolio/skills';
import { Projects } from '@/components/portfolio/projects';
import { EducationSection } from '@/components/portfolio/education-section';
import { CertificatesSection } from '@/components/portfolio/certificates-section';
import { AchievementsSection } from '@/components/portfolio/achievements-section';
import { CoursesSection } from '@/components/portfolio/courses-section';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);

  useEffect(() => {
    async function load() {
      const [p, e, s, pr, ed, cert, ach, crs, st] = await Promise.all([
        profileApi.get(),
        experiencesApi.list(),
        skillsApi.list(),
        projectsApi.list(),
        educationApi.list(),
        certificatesApi.list(),
        achievementsApi.list(),
        coursesApi.list(),
        settingsApi.list(),
      ]);

      setProfile(p);
      setExperiences(e);
      setSkills(s);
      setProjects(pr);
      setEducation(ed);
      setCertificates(cert);
      setAchievements(ach);
      setCourses(crs);
      setSettings(st);
      setLoading(false);
    }
    load();
  }, []);

  function getSetting(key: string): boolean {
    const s = settings.find((x) => x.key === key);
    return s ? s.value === 'true' : true;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const profileData = profile ?? null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profileData?.name ?? '',
    jobTitle: profileData?.title ?? '',
    description: profileData?.bio ?? '',
    email: profileData?.email ?? '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: profileData?.location ?? 'Indonesia',
    },
    url: typeof window !== 'undefined' ? window.location.origin : '',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar profile={profileData} />
      <main>
        <Hero profile={profileData} />
        {getSetting('show_about') && <About profile={profileData} skills={skills} />}
        {getSetting('show_experiences') && <ExperienceSection experiences={experiences} />}
        {getSetting('show_skills') && <Skills skills={skills} />}
        {getSetting('show_projects') && <Projects projects={projects} />}
        {getSetting('show_education') && <EducationSection education={education} />}
        {getSetting('show_certificates') && <CertificatesSection certificates={certificates} />}
        {getSetting('show_achievements') && <AchievementsSection achievements={achievements} />}
        {getSetting('show_courses') && <CoursesSection courses={courses} />}
        {getSetting('show_contact') && <Contact profile={profileData} />}
      </main>
      <Footer profile={profileData} />
    </>
  );
}
