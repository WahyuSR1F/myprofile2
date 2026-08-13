import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(protofolioProfiles).limit(1);
    return NextResponse.json(rows[0] ?? null);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioProfiles).values({ ...body, id });
    const row = await db.select().from(protofolioProfiles).where(eq(protofolioProfiles.id, id)).limit(1);
    return NextResponse.json(row[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    await db.update(protofolioProfiles)
      .set({ ...rest, updated_at: new Date().toISOString() })
      .where(eq(protofolioProfiles.id, id));
    const row = await db.select().from(protofolioProfiles).where(eq(protofolioProfiles.id, id)).limit(1);
    return NextResponse.json(row[0]);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
