import { NextResponse } from 'next/server';
import { getPrisma } from '@orbiqon/db';

// Temporary diagnostic: confirms the deployed app can reach the database and which schema it
// resolves to. Safe to delete once persistence is verified in production.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, reason: 'DATABASE_URL not set at runtime' });
  }
  try {
    const probe = await prisma.$queryRawUnsafe('select current_schema() as schema');
    const waitlistCount = await prisma.waitlist.count();
    return NextResponse.json({ ok: true, probe, waitlistCount });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      name: err?.constructor?.name ?? 'Error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
