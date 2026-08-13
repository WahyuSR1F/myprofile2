'use client';

import { useEffect, useState } from 'react';
import { profileApi, messagesApi, settingsApi } from '@/lib/api';
import type { Profile, Message, Setting } from '@/lib/api';
import { ProfileEditor } from '@/components/admin/profile-editor';
import { ExperienceManager } from '@/components/admin/experience-manager';
import { SkillManager } from '@/components/admin/skill-manager';
import { ProjectManager } from '@/components/admin/project-manager';
import { EducationManager } from '@/components/admin/education-manager';
import { MessageInbox } from '@/components/admin/message-inbox';
import { SettingsManager } from '@/components/admin/settings-manager';
import { AchievementManager } from '@/components/admin/achievement-manager';
import { CourseManager } from '@/components/admin/course-manager';
import { Menu, X, HeartPulse } from 'lucide-react';

type Tab = 'profile' | 'experiences' | 'skills' | 'projects' | 'education' | 'achievements' | 'courses' | 'messages' | 'settings';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [p, m, s] = await Promise.all([
      profileApi.get(),
      messagesApi.list(),
      settingsApi.list(),
    ]);
    setProfile(p);
    setMessages(m);
    setSettings(s);
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'experiences', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'courses', label: 'Courses' },
    { id: 'messages', label: 'Messages', badge: messages.filter((m) => !m.is_read).length },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-secondary">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display font-bold flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" /> Admin
        </span>
      </div>

      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border p-6">
              <span className="font-display text-lg font-bold flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-primary" /> Portfolio Admin
              </span>
              <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1 hover:bg-secondary lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setSidebarOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  {t.label}
                  {t.badge ? (
                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${tab === t.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
                      {t.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {tab === 'profile' && <ProfileEditor profile={profile} onUpdate={loadData} />}
            {tab === 'experiences' && <ExperienceManager />}
            {tab === 'skills' && <SkillManager />}
            {tab === 'projects' && <ProjectManager />}
            {tab === 'education' && <EducationManager />}
            {tab === 'achievements' && <AchievementManager />}
            {tab === 'courses' && <CourseManager />}
            {tab === 'messages' && <MessageInbox messages={messages} onUpdate={loadData} />}
            {tab === 'settings' && <SettingsManager settings={settings} onUpdate={loadData} />}
          </div>
        </main>
      </div>
    </div>
  );
}
