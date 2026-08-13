-- Create tables for portfolio website

-- Profiles
CREATE TABLE protofolio_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  tagline TEXT,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  cv_url TEXT,
  available_for_work BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experiences
CREATE TABLE protofolio_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  location TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills
CREATE TABLE protofolio_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Lainnya',
  proficiency INT DEFAULT 50,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE protofolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  project_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Education
CREATE TABLE protofolio_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages (from contact form)
CREATE TABLE protofolio_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings (toggle sections on/off)
CREATE TABLE protofolio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates
CREATE TABLE protofolio_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT,
  url TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements
CREATE TABLE protofolio_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Courses
CREATE TABLE protofolio_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT,
  date TEXT,
  url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE protofolio_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE protofolio_courses ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read protofolio_profiles" ON protofolio_profiles FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_experiences" ON protofolio_experiences FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_skills" ON protofolio_skills FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_projects" ON protofolio_projects FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_education" ON protofolio_education FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_settings" ON protofolio_settings FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_certificates" ON protofolio_certificates FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_achievements" ON protofolio_achievements FOR SELECT USING (true);
CREATE POLICY "Public read protofolio_courses" ON protofolio_courses FOR SELECT USING (true);

-- Messages: anyone can insert, admin can read
CREATE POLICY "Anyone insert protofolio_messages" ON protofolio_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read protofolio_messages" ON protofolio_messages FOR SELECT USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin all protofolio_profiles" ON protofolio_profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_experiences" ON protofolio_experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_skills" ON protofolio_skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_projects" ON protofolio_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_education" ON protofolio_education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_messages" ON protofolio_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_settings" ON protofolio_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_certificates" ON protofolio_certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_achievements" ON protofolio_achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all protofolio_courses" ON protofolio_courses FOR ALL USING (auth.role() = 'authenticated');

-- Default settings
INSERT INTO protofolio_settings (key, value) VALUES
  ('show_about', 'true'),
  ('show_experiences', 'true'),
  ('show_skills', 'true'),
  ('show_projects', 'true'),
  ('show_education', 'true'),
  ('show_contact', 'true')
ON CONFLICT (key) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON protofolio_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON protofolio_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON protofolio_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON protofolio_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON protofolio_education FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON protofolio_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON protofolio_certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON protofolio_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON protofolio_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
