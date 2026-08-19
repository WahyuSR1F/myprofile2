/**
 * lib/api.ts — client helper untuk fetch API routes
 * Menggantikan supabase client di semua komponen frontend
 */

// ─── Types (same as lib/supabase.ts) ──────────────────────────────────────────

export type Profile = {
  id: string;
  name: string;
  title: string;
  tagline: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  cv_url: string | null;
  available_for_work: boolean;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  achievements: string[];
  location: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  image_url: string | null;
  tech_stack: string[];
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Setting = {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  name: string;
  provider: string | null;
  date: string | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'API error');
  }
  return res.json();
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileApi = {
  get: () => apiFetch<Profile | null>('/api/profiles'),
  save: (data: Partial<Profile> & { id?: string }) =>
    data.id
      ? apiFetch<Profile>('/api/profiles', { method: 'PUT', body: JSON.stringify(data) })
      : apiFetch<Profile>('/api/profiles', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Experiences ──────────────────────────────────────────────────────────────

export const experiencesApi = {
  list: () => apiFetch<Experience[]>('/api/experiences'),
  create: (data: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<Experience>('/api/experiences', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Experience>) =>
    apiFetch<Experience>(`/api/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/experiences/${id}`, { method: 'DELETE' }),
};

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skillsApi = {
  list: () => apiFetch<Skill[]>('/api/skills'),
  create: (data: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<Skill>('/api/skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Skill>) =>
    apiFetch<Skill>(`/api/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/skills/${id}`, { method: 'DELETE' }),
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: () => apiFetch<Project[]>('/api/projects'),
  create: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<Project>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Project>) =>
    apiFetch<Project>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/projects/${id}`, { method: 'DELETE' }),
};

// ─── Education ────────────────────────────────────────────────────────────────

export const educationApi = {
  list: () => apiFetch<Education[]>('/api/education'),
  create: (data: Omit<Education, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<Education>('/api/education', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Education>) =>
    apiFetch<Education>(`/api/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/education/${id}`, { method: 'DELETE' }),
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messagesApi = {
  list: () => apiFetch<Message[]>('/api/messages'),
  send: (data: Pick<Message, 'name' | 'email' | 'subject' | 'message'>) =>
    apiFetch<{ success: boolean }>('/api/messages', { method: 'POST', body: JSON.stringify(data) }),
  markRead: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/messages/${id}`, { method: 'PUT', body: JSON.stringify({ is_read: true }) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/messages/${id}`, { method: 'DELETE' }),
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsApi = {
  list: () => apiFetch<Setting[]>('/api/settings'),
  updateMany: (items: { key: string; value: string }[]) =>
    apiFetch<{ success: boolean }>('/api/settings', { method: 'PUT', body: JSON.stringify(items) }),
  updateOne: (key: string, value: string) =>
    apiFetch<{ success: boolean }>('/api/settings', { method: 'PUT', body: JSON.stringify({ key, value }) }),
};

// ─── Achievements ─────────────────────────────────────────────────────────────

export const achievementsApi = {
  list: () => apiFetch<Achievement[]>('/api/achievements'),
  create: (data: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<Achievement>('/api/achievements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Achievement>) =>
    apiFetch<Achievement>(`/api/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/achievements/${id}`, { method: 'DELETE' }),
};

// ─── Courses ──────────────────────────────────────────────────────────────────

export const coursesApi = {
  list: () => apiFetch<Course[]>('/api/courses'),
  create: (data: Omit<Course, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<Course>('/api/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Course>) =>
    apiFetch<Course>(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/courses/${id}`, { method: 'DELETE' }),
};

// ─── Certificates ─────────────────────────────────────────────────────────────

export const certificatesApi = {
  list: () => apiFetch<Certificate[]>('/api/certificates'),
  create: (data: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<Certificate>('/api/certificates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Certificate>) =>
    apiFetch<Certificate>(`/api/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/certificates/${id}`, { method: 'DELETE' }),
};
