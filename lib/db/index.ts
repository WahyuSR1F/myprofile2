import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Database selalu dari Turso (libsql) — tidak ada fallback ke local.db.
// local.db hanya untuk dev tooling (seed/migrate/sync), bukan runtime.
const remoteUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!remoteUrl || !authToken) {
  throw new Error(
    'TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN wajib di-set. Tambahkan di Vercel Settings → Environment Variables, atau di .env.local untuk dev lokal.'
  );
}

const client = createClient({ url: remoteUrl, authToken });

export const db = drizzle(client, { schema });

export type Database = typeof db;
