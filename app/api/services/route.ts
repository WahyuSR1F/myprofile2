import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioServices } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(protofolioServices).orderBy(asc(protofolioServices.sort_order));
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioServices).values({ ...body, id });
    const row = await db.select().from(protofolioServices).where(eq(protofolioServices.id, id)).limit(1);
    return NextResponse.json(row[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
