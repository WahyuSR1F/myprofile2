/**
 * Migration Turso — menambah kolom baru jika belum ada (idempotent).
 * Jalankan: npx tsx --env-file=.env.local scripts/migrate-turso.ts
 */
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.error('❌ TURSO_DATABASE_URL / TURSO_AUTH_TOKEN belum di-set');
  process.exit(1);
}

const client = createClient({ url, authToken: token });

const ALTER_STATEMENTS = [
  { sql: `ALTER TABLE protofolio_experiences ADD COLUMN image_url TEXT`, label: 'experiences.image_url' },
  { sql: `ALTER TABLE protofolio_projects ADD COLUMN target_pelanggan TEXT DEFAULT '[]'`, label: 'projects.target_pelanggan' },
  { sql: `ALTER TABLE protofolio_projects ADD COLUMN solusi TEXT DEFAULT '[]'`, label: 'projects.solusi' },
  { sql: `ALTER TABLE protofolio_projects ADD COLUMN benefit TEXT DEFAULT '[]'`, label: 'projects.benefit' },
];

async function main() {
  const applied: string[] = [];
  const skipped: string[] = [];

  for (const stmt of ALTER_STATEMENTS) {
    try {
      await client.execute({ sql: stmt.sql, args: [] });
      applied.push(stmt.label);
      console.log(`✅ ditambahkan: ${stmt.label}`);
    } catch (e: any) {
      if (e.message?.includes('duplicate column')) {
        skipped.push(stmt.label);
        console.log(`⏭️  sudah ada : ${stmt.label}`);
      } else {
        throw e;
      }
    }
  }

  // Verify
  const r = await client.execute('PRAGMA table_info(protofolio_projects)');
  console.log('\nKolom protofolio_projects:', r.rows.map((x: any) => x.name).join(', '));
  console.log(`\n🎉 Selesai. ${applied.length} ditambahkan, ${skipped.length} sudah ada.`);
  client.close();
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Gagal:', e.message);
  process.exit(1);
});
