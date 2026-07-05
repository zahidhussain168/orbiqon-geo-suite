import { NextResponse } from 'next/server';
import { loadScan } from '@/lib/scan-service';

// Temporary diagnostic: runs the exact loadScan() the /results/[id] page uses and returns the
// real error. Delete once the results page is confirmed working.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id') ?? '';
  try {
    const result = await loadScan(id);
    return NextResponse.json({ ok: true, found: Boolean(result), brand: result?.brand ?? null });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      name: err?.constructor?.name ?? 'Error',
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? (err.stack ?? '').split('\n').slice(0, 4).join(' | ') : null,
    });
  }
}
