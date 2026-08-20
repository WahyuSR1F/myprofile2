/**
 * Migration script — membuat semua tabel SQLite
 * Jalankan: npm run db:migrate
 */
import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');
const client = createClient({ url: `file:${dbPath}` });

// Semua tabel dalam array individual (bukan multi-statement string)
const tables = [
  `CREATE TABLE IF NOT EXISTS protofolio_profiles (
    id TEXT PRIMARY KEY,
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
    available_for_work INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_experiences (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    current INTEGER DEFAULT 0,
    description TEXT,
    achievements TEXT DEFAULT '[]',
    location TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Lainnya',
    proficiency INTEGER DEFAULT 50,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    image_url TEXT,
    tech_stack TEXT DEFAULT '[]',
    project_url TEXT,
    github_url TEXT,
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_education (
    id TEXT PRIMARY KEY,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_settings (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_certificates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT,
    url TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS protofolio_courses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT,
    date TEXT,
    url TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  // ── SIPD Tables ──────────────────────────────────────────────────────────────

  `CREATE TABLE IF NOT EXISTS sipd_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'pemohon',
    company TEXT,
    phone TEXT,
    avatar_url TEXT,
    password_hash TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS sipd_projects (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    user_id TEXT NOT NULL REFERENCES sipd_profiles(id) ON DELETE CASCADE,
    assigned_to TEXT REFERENCES sipd_profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    submitted_at TEXT,
    reviewed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE INDEX IF NOT EXISTS idx_sipd_projects_user_id ON sipd_projects(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sipd_projects_status ON sipd_projects(status)`,
  `CREATE INDEX IF NOT EXISTS idx_sipd_projects_created_at ON sipd_projects(created_at)`,

  `CREATE TABLE IF NOT EXISTS sipd_project_documents (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES sipd_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by TEXT NOT NULL REFERENCES sipd_profiles(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE INDEX IF NOT EXISTS idx_sipd_docs_project_id ON sipd_project_documents(project_id)`,

  `CREATE TABLE IF NOT EXISTS sipd_project_history (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES sipd_projects(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    notes TEXT,
    actor_id TEXT NOT NULL REFERENCES sipd_profiles(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE INDEX IF NOT EXISTS idx_sipd_history_project_id ON sipd_project_history(project_id)`,

  `CREATE TABLE IF NOT EXISTS sipd_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES sipd_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read INTEGER NOT NULL DEFAULT 0,
    project_id TEXT REFERENCES sipd_projects(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE INDEX IF NOT EXISTS idx_sipd_notif_user_id ON sipd_notifications(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sipd_notif_is_read ON sipd_notifications(user_id, is_read)`,
];

async function migrate() {
  console.log('🔄 Running migrations...');
  console.log(`📁 Database: ${dbPath}`);

  try {
    await client.execute('PRAGMA journal_mode=WAL');
    await client.execute('PRAGMA foreign_keys=ON');

    for (const stmt of tables) {
      await client.execute(stmt);
    }

    // ── Add new columns to protofolio_profiles if missing ──
    const alterCols = [
      "ALTER TABLE protofolio_profiles ADD COLUMN motivasi TEXT",
      "ALTER TABLE protofolio_profiles ADD COLUMN keterangan_pengalaman TEXT",
      "ALTER TABLE protofolio_profiles ADD COLUMN about_highlights TEXT DEFAULT '[]'",
      "ALTER TABLE protofolio_profiles ADD COLUMN about_stats TEXT DEFAULT '[]'",
    ];
    for (const stmt of alterCols) {
      try {
        await client.execute(stmt);
      } catch {
        // Column may already exist — ignore
      }
    }

    // Verify tables
    const result = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    console.log(`✅ Migration complete! Tables: ${result.rows.map((r: any) => r.name).join(', ')}`);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
