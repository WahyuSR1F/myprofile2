import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioCourses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await db.update(protofolioCourses)
      .set({ ...body, updated_at: new Date().toISOString() })
      .where(eq(protofolioCourses.id, params.id));
    const row = await db.select().from(protofolioCourses).where(eq(protofolioCourses.id, params.id)).limit(1);
    return NextResponse.json(row[0]);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(protofolioCourses).where(eq(protofolioCourses.id, params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
