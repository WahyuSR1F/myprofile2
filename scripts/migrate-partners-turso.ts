/**
 * One-off: buat tabel protofolio_partners di Turso (idempotent).
 * Jalankan: npx tsx scripts/migrate-partners-turso.ts
 * Hanya CREATE TABLE IF NOT EXISTS — tidak menyentuh data lain.
 */
import { createClient } from '@libsql/client';

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    console.error('❌ TURSO_DATABASE_URL / TURSO_AUTH_TOKEN belum di-set di .env.local');
    process.exit(1);
  }

  const client = createClient({ url, authToken: token });

  await client.execute(`CREATE TABLE IF NOT EXISTS protofolio_partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);

  const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='protofolio_partners'");
  if (res.rows.length > 0) {
    console.log('✅ Tabel protofolio_partners siap di Turso.');
  } else {
    console.error('❌ Tabel tidak ditemukan setelah CREATE.');
    process.exit(1);
  }

  client.close();
}

main().catch((err) => {
  console.error('❌ Gagal:', err);
  process.exit(1);
});
