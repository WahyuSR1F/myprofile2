import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import path from 'path';
import * as schema from './schema';

const remoteUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const localDbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');

/** SQLite lokal (default) atau Turso jika env vars di-set. */
export function createDbClient(): Client {
  if (remoteUrl && authToken) {
    return createClient({ url: remoteUrl, authToken });
  }
  return createClient({ url: `file:${localDbPath}` });
}

const client = createDbClient();

export const db = drizzle(client, { schema });

export type Database = typeof db;
