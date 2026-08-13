import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

// Jika TURSO_DATABASE_URL di-set, pakai database remote (Turso/libsql).
// Jika tidak, fallback ke file local.db di root project.
const remoteUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const dbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');

const client = remoteUrl
  ? createClient({ url: remoteUrl, authToken })
  : createClient({ url: `file:${dbPath}` });

export const db = drizzle(client, { schema });

export type Database = typeof db;
