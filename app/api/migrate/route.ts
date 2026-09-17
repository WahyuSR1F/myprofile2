import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Idempotent ALTER statements — "duplicate column" errors are ignored.
const ALTER_STATEMENTS = [
  { sql: `ALTER TABLE protofolio_experiences ADD COLUMN image_url TEXT`, label: 'experiences.image_url' },
  { sql: `ALTER TABLE protofolio_projects ADD COLUMN target_pelanggan TEXT DEFAULT '[]'`, label: 'projects.target_pelanggan' },
  { sql: `ALTER TABLE protofolio_projects ADD COLUMN solusi TEXT DEFAULT '[]'`, label: 'projects.solusi' },
  { sql: `ALTER TABLE protofolio_projects ADD COLUMN benefit TEXT DEFAULT '[]'`, label: 'projects.benefit' },
];

export async function POST() {
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const applied: string[] = [];
    const skipped: string[] = [];

    for (const stmt of ALTER_STATEMENTS) {
      try {
        await client.execute({ sql: stmt.sql, args: [] });
        applied.push(stmt.label);
      } catch (e: any) {
        if (e.message?.includes('duplicate column')) {
          skipped.push(stmt.label);
        } else {
          throw e;
        }
      }
    }

    await client.close();
    return NextResponse.json({ success: true, applied, skipped });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
