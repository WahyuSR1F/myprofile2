import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioExperiences } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

function parseRow(row: any) {
  return {
    ...row,
    achievements: (() => { try { return JSON.parse(row.achievements ?? '[]'); } catch { return []; } })(),
    current: Boolean(row.current),
  };
}

export async function GET() {
  try {
    const rows = await db.select().from(protofolioExperiences).orderBy(asc(protofolioExperiences.sort_order));
    return NextResponse.json(rows.map(parseRow));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioExperiences).values({
      ...body,
      id,
      achievements: JSON.stringify(body.achievements ?? []),
    });
    const row = await db.select().from(protofolioExperiences).where(eq(protofolioExperiences.id, id)).limit(1);
    return NextResponse.json(parseRow(row[0]), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
