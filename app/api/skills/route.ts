import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioSkills } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(protofolioSkills)
      .orderBy(asc(protofolioSkills.category), asc(protofolioSkills.sort_order));
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioSkills).values({ ...body, id });
    const row = await db.select().from(protofolioSkills).where(eq(protofolioSkills.id, id)).limit(1);
    return NextResponse.json(row[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
