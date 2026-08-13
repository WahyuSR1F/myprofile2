import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await db.update(protofolioMessages).set(body).where(eq(protofolioMessages.id, params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(protofolioMessages).where(eq(protofolioMessages.id, params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
