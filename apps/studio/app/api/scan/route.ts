import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runScan } from '@/lib/scan-service';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

// LLM calls need the Node runtime; never cache scan responses.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ScanSchema = z.object({
  brand: z.string().min(1, 'Brand is required').max(120),
  website: z.string().max(200).optional(),
  category: z.string().max(120).optional(),
  prompts: z.array(z.string().min(1).max(300)).max(25).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit reached. Please try again later.', resetAt: rl.resetAt },
      { status: 429, headers: rateHeaders(rl) },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ScanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await runScan(parsed.data);
    return NextResponse.json(result, { headers: rateHeaders(rl) });
  } catch (err) {
    console.error('[amicited] scan failed:', err);
    return NextResponse.json({ error: 'Scan failed. Please try again.' }, { status: 500 });
  }
}

function rateHeaders(rl: ReturnType<typeof checkRateLimit>): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
  };
}
