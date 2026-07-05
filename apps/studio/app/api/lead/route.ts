import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@orbiqon/db';
import { sendReportEmail } from '@/lib/email/send-report';
import type { ScanResult } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LeadSchema = z.object({
  email: z.string().email('A valid email is required').max(200),
  scanId: z.string().max(60).optional(),
  /** Which capture produced the lead (e.g. 'full-report', 'fix-waitlist'). Additive, optional. */
  source: z.string().max(40).optional(),
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
    console.info(
      `[amicited] lead captured (no DB configured, source=${parsed.data.source ?? 'unknown'}):`,
      parsed.data.email,
    );
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    // Only link the scanId if it actually exists (avoids a FK error on a stale/unknown id).
    // Select resultJson too, so a 'full-report' lead can email the report without a second query.
    const scan = parsed.data.scanId
      ? await prisma.scan.findUnique({
          where: { id: parsed.data.scanId },
          select: { id: true, resultJson: true },
        })
      : null;

    await prisma.lead.create({
      data: { email: parsed.data.email, scanId: scan?.id, source: parsed.data.source },
    });

    // The report email is best-effort: a delivery failure should not turn a successful lead
    // capture into a 500, the lead is already saved either way.
    let emailed = false;
    if (parsed.data.source === 'full-report' && scan?.resultJson) {
      try {
        const result = scan.resultJson as unknown as ScanResult;
        const { sent } = await sendReportEmail(parsed.data.email, result);
        emailed = sent;
      } catch (err) {
        console.error('[amicited] report email threw:', err);
      }
    }

    return NextResponse.json({ ok: true, persisted: true, emailed });
  } catch (err) {
    console.error('[amicited] lead capture failed:', err);
    return NextResponse.json({ error: 'Could not save email.' }, { status: 500 });
  }
}
