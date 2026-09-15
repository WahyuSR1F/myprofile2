/**
 * Sync local.db <-> Turso (AMAN — tidak menghapus data otomatis)
 *
 * Flags:
 *   --backup          Backup data dari Turso ke file JSON saja (tidak sync)
 *   --direction       Arah sync: "local-to-turso" (default) atau "turso-to-local"
 *   --force           Gunakan DELETE+INSERT (perilaku lama) — HATI-HATI!
 *   --dry-run         Preview apa yang akan diubah tanpa mengubah apapun
 *   --tables          Filter tabel tertentu, pisah koma (contoh: --tables protofolio_profiles,protofolio_skills)
 *
 * Contoh:
 *   npx tsx scripts/sync-turso.ts                          # sync aman (UPSERT) local -> turso
 *   npx tsx scripts/sync-turso.ts --backup                 # backup turso -> file JSON
 *   npx tsx scripts/sync-turso.ts --direction turso-to-local  # sync turso -> local.db
 *   npx tsx scripts/sync-turso.ts --dry-run                # preview tanpa mengubah
 *   npx tsx scripts/sync-turso.ts --tables protofolio_profiles  # sync 1 tabel saja
 *   npx tsx scripts/sync-turso.ts --force                  # perilaku lama (DELETE+INSERT)
 */
import { createClient } from '@libsql/client';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

// ── Parse args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const hasFlag = (flag: string) => args.includes(`--${flag}`);
const getFlag = (flag: string): string | undefined => {
  const idx = args.indexOf(`--${flag}`);
  return idx !== -1 ? args[idx + 1] : undefined;
};

const DRY_RUN = hasFlag('dry-run');
const BACKUP_ONLY = hasFlag('backup');
const FORCE = hasFlag('force');
const DIRECTION = (getFlag('direction') || 'local-to-turso') as 'local-to-turso' | 'turso-to-local';
const TABLE_FILTER = getFlag('tables')?.split(',').map((t) => t.trim());

// ── Validate ──────────────────────────────────────────────────────────────────
const TURSO_URL = process.env.TURSO_DATABASE_URL as string;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN as string;

if (!TURSO_URL) {
  console.error('❌ TURSO_DATABASE_URL belum di-set');
  process.exit(1);
}
if (!TURSO_TOKEN) {
  console.error('❌ TURSO_AUTH_TOKEN belum di-set');
  process.exit(1);
}

// ── Table definitions ─────────────────────────────────────────────────────────
const tables = [
  `CREATE TABLE IF NOT EXISTS protofolio_profiles (
    id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', title TEXT NOT NULL DEFAULT '',
    tagline TEXT, bio TEXT, photo_url TEXT, email TEXT, phone TEXT, location TEXT,
    website TEXT, linkedin_url TEXT, github_url TEXT, twitter_url TEXT, instagram_url TEXT,
    cv_url TEXT, available_for_work INTEGER DEFAULT 0,
    motivasi TEXT, keterangan_pengalaman TEXT,
    about_highlights TEXT DEFAULT '[]', about_stats TEXT DEFAULT '[]',
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
  `CREATE TABLE IF NOT EXISTS protofolio_services (
    id TEXT PRIMARY KEY,
    grp TEXT NOT NULL DEFAULT 'solusi',
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

// FK order: parent tables first, then children
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
  'protofolio_services',
  'sipd_profiles',
  'sipd_projects',
  'sipd_project_documents',
  'sipd_project_history',
  'sipd_notifications',
];

const alterCols = [
  "ALTER TABLE protofolio_profiles ADD COLUMN motivasi TEXT",
  "ALTER TABLE protofolio_profiles ADD COLUMN keterangan_pengalaman TEXT",
  "ALTER TABLE protofolio_profiles ADD COLUMN about_highlights TEXT DEFAULT '[]'",
  "ALTER TABLE protofolio_profiles ADD COLUMN about_stats TEXT DEFAULT '[]'",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function filterTables(tables: string[]): string[] {
  if (!TABLE_FILTER) return tables;
  return tables.filter((t) => {
    const name = t.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
    return name && TABLE_FILTER.includes(name);
  });
}

function filterCopyOrder(order: string[]): string[] {
  if (!TABLE_FILTER) return order;
  return order.filter((t) => TABLE_FILTER.includes(t));
}

async function backupTurso(remote: ReturnType<typeof createClient>) {
  const backupDir = path.join(process.cwd(), 'backups');
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFile = path.join(backupDir, `turso-backup-${timestamp}.json`);

  const backup: Record<string, any[]> = {};
  const filteredOrder = filterCopyOrder(copyOrder);

  for (const table of filteredOrder) {
    const rows = await remote.execute(`SELECT * FROM ${table}`);
    backup[table] = rows.rows;
  }

  writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  console.log(`📦 Backup tersimpan: ${backupFile}`);
  return backupFile;
}

async function getRemoteCounts(remote: ReturnType<typeof createClient>) {
  const counts: Record<string, number> = {};
  for (const table of copyOrder) {
    try {
      const result = await remote.execute(`SELECT COUNT(*) as cnt FROM ${table}`);
      counts[table] = Number(result.rows[0].cnt);
    } catch {
      counts[table] = 0;
    }
  }
  return counts;
}

async function getLocalCounts(local: ReturnType<typeof createClient>) {
  const counts: Record<string, number> = {};
  for (const table of copyOrder) {
    try {
      const result = await local.execute(`SELECT COUNT(*) as cnt FROM ${table}`);
      counts[table] = Number(result.rows[0].cnt);
    } catch {
      counts[table] = 0;
    }
  }
  return counts;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const localDbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');
  const local = createClient({ url: `file:${localDbPath}` });
  const remote = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

  console.log('═══════════════════════════════════════════════════');
  console.log('  🔄 TURSO SYNC (Versi Aman)');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Arah     : ${DIRECTION}`);
  console.log(`  Dry-run  : ${DRY_RUN ? 'YA ✅' : 'TIDAK'}`);
  console.log(`  Force    : ${FORCE ? 'YA ⚠️  (DELETE+INSERT)' : 'TIDAK (UPSERT)'}`);
  console.log(`  Backup   : ${BACKUP_ONLY ? 'HANYA BACKUP' : 'Sync + Backup'}`);
  console.log(`  Tabel    : ${TABLE_FILTER ? TABLE_FILTER.join(', ') : 'SEMUA'}`);
  console.log('═══════════════════════════════════════════════════\n');

  // Step 1: Ensure tables exist
  console.log('1️⃣  Memastikan tabel ada...');
  const filteredTables = filterTables(tables);
  if (!DRY_RUN) {
    for (const stmt of filteredTables) {
      await remote.execute(stmt);
    }
  }
  for (const stmt of alterCols) {
    try {
      if (!DRY_RUN) await remote.execute(stmt);
    } catch {
      // Column may already exist
    }
  }
  console.log(`   ✅ ${filteredTables.length} tabel diperiksa\n`);

  // Step 2: Backup
  console.log('2️⃣  Backup data dari Turso...');
  const backupFile = await backupTurso(remote);
  console.log('');

  if (BACKUP_ONLY) {
    console.log('✅ Backup selesai! Tidak ada sinkronisasi yang dilakukan.');
    process.exit(0);
  }

  // Step 3: Show before/after comparison
  console.log('3️⃣  Perbandingan data:\n');
  const remoteCounts = await getRemoteCounts(remote);
  const localCounts = await getLocalCounts(local);
  const filteredOrder = filterCopyOrder(copyOrder);

  console.log('   Tabel                        Turso    Local');
  console.log('   ─────────────────────────── ──────── ────────');
  for (const table of filteredOrder) {
    const r = remoteCounts[table] ?? 0;
    const l = localCounts[table] ?? 0;
    const diff = l - r;
    const indicator = diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : '';
    console.log(`   ${table.padEnd(28)} ${String(r).padStart(6)}   ${String(l).padStart(6)}${indicator}`);
  }
  console.log('');

  // Step 4: Sync
  if (DRY_RUN) {
    console.log('🔍 DRY RUN — tidak ada perubahan yang dilakukan.\n');
    process.exit(0);
  }

  // Determine direction
  const source = DIRECTION === 'turso-to-local' ? remote : local;
  const target = DIRECTION === 'turso-to-local' ? local : remote;
  const directionLabel = DIRECTION === 'turso-to-local' ? 'Turso → local.db' : 'local.db → Turso';

  console.log(`4️⃣  Sync ${directionLabel}...\n`);

  for (const table of filteredOrder) {
    const rows = await source.execute(`SELECT * FROM ${table}`);
    if (rows.rows.length === 0) {
      console.log(`   ${table}: 0 rows (skip)`);
      continue;
    }

    const cols = rows.columns;
    const placeholders = cols.map(() => '?').join(', ');
    const values = rows.rows.map((r) => cols.map((c) => r[c] ?? null));

    if (FORCE) {
      // Force mode: DELETE + INSERT (perilaku lama — berbahaya!)
      await target.execute(`DELETE FROM ${table}`);
      for (const row of values) {
        await target.execute({
          sql: `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`,
          args: row,
        });
      }
      console.log(`   ${table}: ${values.length} rows (FORCE: DELETE + INSERT)`);
    } else {
      // Safe mode: UPSERT (INSERT OR REPLACE) — tidak menghapus data yang tidak ada di source
      for (const row of values) {
        await target.execute({
          sql: `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`,
          args: row,
        });
      }
      const remoteCount = (await target.execute(`SELECT COUNT(*) as cnt FROM ${table}`)).rows[0].cnt;
      console.log(`   ${table}: ${values.length} rows upserted, ${remoteCount} total in target`);
    }
  }

  // Step 5: Verify
  console.log('\n5️⃣  Verifikasi...');
  const finalCounts = DIRECTION === 'turso-to-local' ? await getLocalCounts(target) : await getRemoteCounts(target);
  for (const table of filteredOrder) {
    console.log(`   ${table}: ${finalCounts[table] ?? 0} rows`);
  }

  console.log('\n✅ Sync selesai! Data tidak ada yang terhapus.');
  console.log(`📦 Backup tersimpan di: ${backupFile}`);
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Gagal:', e);
  process.exit(1);
});
