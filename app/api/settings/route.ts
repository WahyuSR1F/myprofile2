import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(protofolioSettings);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Body: array of { key, value } OR single { key, value }
    const body = await req.json();
    const items: { key: string; value: string }[] = Array.isArray(body) ? body : [body];
    for (const item of items) {
      await db.update(protofolioSettings)
        .set({ value: item.value, updated_at: new Date().toISOString() })
        .where(eq(protofolioSettings.key, item.key));
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
