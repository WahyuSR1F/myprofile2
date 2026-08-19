import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function POST() {
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    
    await client.execute({
      sql: `ALTER TABLE protofolio_experiences ADD COLUMN image_url TEXT`,
      args: [],
    });
    
    await client.close();
    return NextResponse.json({ success: true, message: 'Added image_url column' });
  } catch (e: any) {
    if (e.message?.includes('duplicate column')) {
      return NextResponse.json({ success: true, message: 'Column already exists' });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
