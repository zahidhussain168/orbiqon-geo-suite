import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@orbiqon/db';
import { toolBySlug } from '@orbiqon/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WaitlistSchema = z.object({
  email: z.string().email('A valid email is required').max(200),
  toolSlug: z.string().max(60),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (!toolBySlug(parsed.data.toolSlug)) {
    return NextResponse.json({ error: 'Unknown tool' }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    // Graceful degradation: no DB configured. Accept so the UX still works locally.
    console.info(
      `[studio] waitlist signup (no DB), tool=${parsed.data.toolSlug}:`,
      parsed.data.email,
    );
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await prisma.waitlist.upsert({
      where: { email_toolSlug: { email: parsed.data.email, toolSlug: parsed.data.toolSlug } },
      create: { email: parsed.data.email, toolSlug: parsed.data.toolSlug },
      update: {},
    });
    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error('[studio] waitlist signup failed:', err);
    return NextResponse.json({ error: 'Could not save your email.' }, { status: 500 });
  }
}
