import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@orbiqon/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LeadSchema = z.object({
  email: z.string().email('A valid email is required').max(200),
  scanId: z.string().max(60).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    // Graceful degradation: no DB configured. Accept the email so the UX still works locally.
    console.info('[amicited] lead captured (no DB configured):', parsed.data.email);
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    // Only link the scanId if it actually exists (avoids a FK error on a stale/unknown id).
    const scanId = parsed.data.scanId
      ? (await prisma.scan.findUnique({ where: { id: parsed.data.scanId }, select: { id: true } }))
          ?.id
      : undefined;
    await prisma.lead.create({ data: { email: parsed.data.email, scanId } });
    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error('[amicited] lead capture failed:', err);
    return NextResponse.json({ error: 'Could not save email.' }, { status: 500 });
  }
}
