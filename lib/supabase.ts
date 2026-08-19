import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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
