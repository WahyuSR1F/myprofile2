import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioMessages } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(protofolioMessages).orderBy(desc(protofolioMessages.created_at));
    return NextResponse.json(rows.map(r => ({ ...r, is_read: Boolean(r.is_read) })));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioMessages).values({ ...body, id, is_read: false });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
