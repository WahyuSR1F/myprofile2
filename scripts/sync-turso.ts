/**
 * Sync local.db -> Turso
 * Membuat tabel + menyalin seluruh data dari local.db ke database Turso.
 * Jalankan: npx tsx scripts/sync-turso.ts
 */
import { createClient } from '@libsql/client';
import path from 'path';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL) {
  console.error('❌ TURSO_DATABASE_URL belum di-set');
  process.exit(1);
}
if (!TURSO_TOKEN) {
  console.error('❌ TURSO_AUTH_TOKEN belum di-set');
  process.exit(1);
}

const localDbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');
const local = createClient({ url: `file:${localDbPath}` });
const remote = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

const tables = [
  `CREATE TABLE IF NOT EXISTS protofolio_profiles (
    id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', title TEXT NOT NULL DEFAULT '',
    tagline TEXT, bio TEXT, photo_url TEXT, email TEXT, phone TEXT, location TEXT,
    website TEXT, linkedin_url TEXT, github_url TEXT, twitter_url TEXT, instagram_url TEXT,
    cv_url TEXT, available_for_work INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_experiences (
    id TEXT PRIMARY KEY, company TEXT NOT NULL, position TEXT NOT NULL,
    start_date TEXT NOT NULL, end_date TEXT, current INTEGER DEFAULT 0, description TEXT,
    achievements TEXT DEFAULT '[]', location TEXT, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_skills (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'Lainnya',
    proficiency INTEGER DEFAULT 50, icon TEXT, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_projects (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, long_description TEXT,
    image_url TEXT, tech_stack TEXT DEFAULT '[]', project_url TEXT, github_url TEXT,
    featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_education (
    id TEXT PRIMARY KEY, institution TEXT NOT NULL, degree TEXT NOT NULL, field TEXT,
    start_date TEXT, end_date TEXT, description TEXT, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_messages (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT,
    message TEXT NOT NULL, is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_settings (
    id TEXT PRIMARY KEY, key TEXT NOT NULL UNIQUE, value TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_certificates (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, issuer TEXT NOT NULL, date TEXT,
    url TEXT, image_url TEXT, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_achievements (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, date TEXT, icon TEXT,
    image_url TEXT, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS protofolio_courses (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, provider TEXT, date TEXT, url TEXT,
    image_url TEXT, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sipd_profiles (
    id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'pemohon', company TEXT, phone TEXT, avatar_url TEXT,
    password_hash TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sipd_projects (
    id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    user_id TEXT NOT NULL REFERENCES sipd_profiles(id) ON DELETE CASCADE,
    assigned_to TEXT REFERENCES sipd_profiles(id) ON DELETE SET NULL,
    review_notes TEXT, submitted_at TEXT, reviewed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sipd_project_documents (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES sipd_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL, file_url TEXT NOT NULL, file_size INTEGER, mime_type TEXT,
    uploaded_by TEXT NOT NULL REFERENCES sipd_profiles(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sipd_project_history (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES sipd_projects(id) ON DELETE CASCADE,
    from_status TEXT, to_status TEXT NOT NULL, notes TEXT,
    actor_id TEXT NOT NULL REFERENCES sipd_profiles(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sipd_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES sipd_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL, message TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'info',
    is_read INTEGER NOT NULL DEFAULT 0,
    project_id TEXT REFERENCES sipd_projects(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

// Urutan penting: tabel induk dulu (tanpa FK), lalu tabel dengan FK
const copyOrder = [
  'protofolio_settings',
  'protofolio_profiles',
  'protofolio_experiences',
  'protofolio_skills',
  'protofolio_projects',
  'protofolio_education',
  'protofolio_messages',
  'protofolio_certificates',
  'protofolio_achievements',
  'protofolio_courses',
  'sipd_profiles',
  'sipd_projects',
  'sipd_project_documents',
  'sipd_project_history',
  'sipd_notifications',
];

async function main() {
  console.log('🔄 Membuat tabel di Turso...');
  for (const stmt of tables) {
    await remote.execute(stmt);
  }

  console.log('📊 Menyalin data local.db -> Turso...');
  for (const table of copyOrder) {
    const rows = await local.execute(`SELECT * FROM ${table}`);
    if (rows.rows.length === 0) {
      console.log(`  ${table}: 0 rows`);
      continue;
    }
    const cols = rows.columns;
    const placeholders = cols.map(() => '?').join(', ');
    const values = rows.rows.map((r) => cols.map((c) => r[c] ?? null));
    await remote.execute(`DELETE FROM ${table}`);
    for (const row of values) {
      await remote.execute(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`, row);
    }
    console.log(`  ${table}: ${values.length} rows`);
  }

  const verify = await remote.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('✅ Sync selesai! Tabel di Turso:', verify.rows.map((r: any) => r.name).join(', '));
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Gagal:', e);
  process.exit(1);
});
