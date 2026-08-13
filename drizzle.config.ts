import { defineConfig } from 'drizzle-kit';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${dbPath}`,
  },
});
