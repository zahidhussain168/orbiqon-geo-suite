/**
 * IP rate limiting for /api/scan. This is an unauthenticated free tool, one shared link can
 * otherwise run up an API bill. Sliding-window counter, `SCAN_RATE_LIMIT` scans per IP per hour.
 *
 * NOTE: this is an in-memory limiter, per server instance. It's the right default for local/dev
 * and single-instance deploys; for multi-instance production, back it with Redis/Upstash behind
 * this same interface.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // epoch ms when the window frees up
}

export function checkRateLimit(ip: string, now = Date.now()): RateLimitResult {
  const limit = parseLimit(process.env.SCAN_RATE_LIMIT, 10);
  const windowStart = now - WINDOW_MS;

  const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  const allowed = recent.length < limit;
  if (allowed) {
    recent.push(now);
    hits.set(ip, recent);
  }

  const oldest = recent[0] ?? now;
  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - recent.length),
    resetAt: oldest + WINDOW_MS,
  };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return headers.get('x-real-ip') ?? '127.0.0.1';
}

function parseLimit(raw: string | undefined, fallback: number): number {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
