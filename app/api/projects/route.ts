import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { protofolioProjects } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  try { return JSON.parse((value as string) ?? '[]'); } catch { return []; }
}

function parseRow(row: any) {
  return {
    ...row,
    tech_stack: parseJsonArray(row.tech_stack),
    target_pelanggan: parseJsonArray(row.target_pelanggan),
    solusi: parseJsonArray(row.solusi),
    benefit: parseJsonArray(row.benefit),
    featured: Boolean(row.featured),
  };
}

export async function GET() {
  try {
    const rows = await db.select().from(protofolioProjects).orderBy(asc(protofolioProjects.sort_order));
    return NextResponse.json(rows.map(parseRow));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.insert(protofolioProjects).values({
      ...body,
      id,
      tech_stack: JSON.stringify(body.tech_stack ?? []),
      target_pelanggan: JSON.stringify(body.target_pelanggan ?? []),
      solusi: JSON.stringify(body.solusi ?? []),
      benefit: JSON.stringify(body.benefit ?? []),
    });
    const row = await db.select().from(protofolioProjects).where(eq(protofolioProjects.id, id)).limit(1);
    return NextResponse.json(parseRow(row[0]), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
