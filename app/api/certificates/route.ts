import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioCertificates } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(protofolioCertificates).orderBy(asc(protofolioCertificates.sort_order));
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioCertificates).values({ ...body, id });
    const row = await db.select().from(protofolioCertificates).where(eq(protofolioCertificates.id, id)).limit(1);
    return NextResponse.json(row[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
