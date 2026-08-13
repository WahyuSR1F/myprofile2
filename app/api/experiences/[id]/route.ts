import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioExperiences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function parseRow(row: any) {
  return {
    ...row,
    achievements: (() => { try { return JSON.parse(row.achievements ?? '[]'); } catch { return []; } })(),
    current: Boolean(row.current),
  };
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await db.update(protofolioExperiences)
      .set({ ...body, achievements: JSON.stringify(body.achievements ?? []), updated_at: new Date().toISOString() })
      .where(eq(protofolioExperiences.id, params.id));
    const row = await db.select().from(protofolioExperiences).where(eq(protofolioExperiences.id, params.id)).limit(1);
    return NextResponse.json(parseRow(row[0]));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(protofolioExperiences).where(eq(protofolioExperiences.id, params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
