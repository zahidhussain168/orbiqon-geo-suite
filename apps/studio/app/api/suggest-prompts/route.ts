import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePrompts } from '@/lib/prompt-gen';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  brand: z.string().min(1).max(120),
  website: z.string().max(200).optional(),
  category: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const prompts = await generatePrompts({
    brand: parsed.data.brand.trim(),
    website: parsed.data.website?.trim() || undefined,
    category: parsed.data.category?.trim() || undefined,
  });
  return NextResponse.json({ prompts });
}
