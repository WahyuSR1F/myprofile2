import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

// Database file: local.db di root project
// Forward slashes required for libsql URL on Windows
const dbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');

const client = createClient({
  url: `file:${dbPath}`,
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
