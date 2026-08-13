import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await db.update(protofolioProjects)
      .set({ ...body, tech_stack: JSON.stringify(body.tech_stack ?? []), updated_at: new Date().toISOString() })
      .where(eq(protofolioProjects.id, params.id));
    const row = await db.select().from(protofolioProjects).where(eq(protofolioProjects.id, params.id)).limit(1);
    const r = row[0] as any;
    return NextResponse.json({ ...r, tech_stack: (() => { try { return JSON.parse(r.tech_stack); } catch { return []; } })(), featured: Boolean(r.featured) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(protofolioProjects).where(eq(protofolioProjects.id, params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
