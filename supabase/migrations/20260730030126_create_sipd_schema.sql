
/*
# Sistem Informasi Persetujuan Dokumen (SIPD) — Initial Schema

## Overview
Full schema for a government document approval system with two roles:
- pemohon: applicant who submits document requests
- penilai: reviewer/evaluator who assesses and approves/rejects requests

## Tables Created
1. `profiles` — extends auth.users with role, company info, phone
2. `projects` — permohonan/document requests with status workflow
3. `project_documents` — files attached to each project
4. `project_history` — audit log of all status transitions
5. `notifications` — per-user in-app notifications

## Status Workflow
draft → submitted → admin_verification → under_review → approved | revision | rejected
revision → submitted (resubmit loop)

## Performance
- Indexes on status, user_id, created_at for fast filtering on millions of rows
- Composite indexes for common query patterns

## Security
- RLS enabled on all tables
- pemohon sees only own rows; penilai sees all rows via helper function
*/

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT '',
  email      text NOT NULL DEFAULT '',
  role       text NOT NULL DEFAULT 'pemohon' CHECK (role IN ('pemohon','penilai','admin')),
  company    text,
  phone      text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text UNIQUE NOT NULL,
  title           text NOT NULL,
  description     text,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN (
                    'draft','submitted','admin_verification','under_review',
                    'approved','revision','rejected'
                  )),
  user_id         uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes    text,
  submitted_at    timestamptz,
  reviewed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id    ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status     ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_code       ON projects(code);
CREATE INDEX IF NOT EXISTS idx_projects_user_status ON projects(user_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_title_search ON projects USING gin(to_tsvector('simple', title));

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Helper: is current user a penilai/admin?
CREATE OR REPLACE FUNCTION is_reviewer()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('penilai','admin')
  );
$$;

DROP POLICY IF EXISTS "projects_select" ON projects;
CREATE POLICY "projects_select" ON projects FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_reviewer());

DROP POLICY IF EXISTS "projects_insert" ON projects;
CREATE POLICY "projects_insert" ON projects FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_update" ON projects;
CREATE POLICY "projects_update" ON projects FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR is_reviewer())
  WITH CHECK (auth.uid() = user_id OR is_reviewer());

DROP POLICY IF EXISTS "projects_delete" ON projects;
CREATE POLICY "projects_delete" ON projects FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND status = 'draft');

-- ─── Project Documents ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        text NOT NULL,
  file_url    text NOT NULL,
  file_size   bigint,
  mime_type   text,
  uploaded_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_docs_project_id ON project_documents(project_id);

ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "docs_select" ON project_documents;
CREATE POLICY "docs_select" ON project_documents FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND (p.user_id = auth.uid() OR is_reviewer()))
  );

DROP POLICY IF EXISTS "docs_insert" ON project_documents;
CREATE POLICY "docs_insert" ON project_documents FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND p.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "docs_update" ON project_documents;
CREATE POLICY "docs_update" ON project_documents FOR UPDATE TO authenticated
  USING (uploaded_by = auth.uid()) WITH CHECK (uploaded_by = auth.uid());

DROP POLICY IF EXISTS "docs_delete" ON project_documents;
CREATE POLICY "docs_delete" ON project_documents FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid());

-- ─── Project History (Audit Log) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  from_status text,
  to_status   text NOT NULL,
  notes       text,
  actor_id    uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_history_project_id  ON project_history(project_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at  ON project_history(created_at DESC);

ALTER TABLE project_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "history_select" ON project_history;
CREATE POLICY "history_select" ON project_history FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND (p.user_id = auth.uid() OR is_reviewer()))
  );

DROP POLICY IF EXISTS "history_insert" ON project_history;
CREATE POLICY "history_insert" ON project_history FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

DROP POLICY IF EXISTS "history_update" ON project_history;
CREATE POLICY "history_update" ON project_history FOR UPDATE TO authenticated
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "history_delete" ON project_history;
CREATE POLICY "history_delete" ON project_history FOR DELETE TO authenticated
  USING (false);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  message    text NOT NULL,
  type       text NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  is_read    boolean NOT NULL DEFAULT false,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_id    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_is_read    ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notif_select" ON notifications;
CREATE POLICY "notif_select" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_insert" ON notifications;
CREATE POLICY "notif_insert" ON notifications FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "notif_update" ON notifications;
CREATE POLICY "notif_update" ON notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_delete" ON notifications;
CREATE POLICY "notif_delete" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─── Auto-generate project code ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  seq int;
  yr  text := to_char(now(), 'YYYY');
BEGIN
  SELECT COUNT(*) + 1 INTO seq FROM projects WHERE code LIKE 'PRJ-' || yr || '-%';
  NEW.code := 'PRJ-' || yr || '-' || LPAD(seq::text, 5, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_project_code ON projects;
CREATE TRIGGER trg_project_code
  BEFORE INSERT ON projects
  FOR EACH ROW
  WHEN (NEW.code IS NULL OR NEW.code = '')
  EXECUTE FUNCTION generate_project_code();

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
