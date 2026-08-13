import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioAchievements } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(protofolioAchievements).orderBy(asc(protofolioAchievements.sort_order));
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioAchievements).values({ ...body, id });
    const row = await db.select().from(protofolioAchievements).where(eq(protofolioAchievements.id, id)).limit(1);
    return NextResponse.json(row[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
