/**
 * Cost controls. This is an unauthenticated free tool — one shared link can otherwise run up
 * an API bill. Two mechanisms:
 *
 *  1. {@link clampScanInputs} — hard caps on prompts and samples BEFORE anything runs.
 *  2. {@link CostGuard} — a per-scan budget of live calls (`maxPrompts * maxSamples`). Cached
 *     calls are free and do NOT consume budget. When exhausted, remaining samples are skipped
 *     and reported as `cappedCalls` rather than silently making more calls.
 */

export const DEFAULT_MAX_PROMPTS = 5;
export const DEFAULT_MAX_SAMPLES = 5;
export const DEFAULT_SAMPLES = 3;

export interface ScanLimits {
  maxPrompts: number;
  maxSamples: number;
}

/** Read caps from env with safe fallbacks. */
export function limitsFromEnv(env: NodeJS.ProcessEnv = process.env): ScanLimits {
  return {
    maxPrompts: clampInt(env.MAX_PROMPTS, DEFAULT_MAX_PROMPTS, 1, 25),
    maxSamples: clampInt(env.MAX_SAMPLES, DEFAULT_MAX_SAMPLES, 1, 10),
  };
}

/** Default sample count from env (bounded by maxSamples at run time). */
export function samplesFromEnv(env: NodeJS.ProcessEnv = process.env): number {
  return clampInt(env.QUERY_ENGINE_SAMPLES, DEFAULT_SAMPLES, 1, 10);
}

export interface ClampedInputs {
  prompts: string[];
  samples: number;
  /** Total live-call budget for the whole scan. */
  maxCalls: number;
  dropped: { prompts: number };
}

/** Trim prompts/samples to the configured caps. */
export function clampScanInputs(
  prompts: string[],
  requestedSamples: number,
  limits: ScanLimits,
): ClampedInputs {
  const deduped = dedupe(prompts.map((p) => p.trim()).filter(Boolean));
  const kept = deduped.slice(0, limits.maxPrompts);
  const samples = clampInt(String(requestedSamples), DEFAULT_SAMPLES, 1, limits.maxSamples);
  return {
    prompts: kept,
    samples,
    maxCalls: limits.maxPrompts * limits.maxSamples,
    dropped: { prompts: Math.max(0, deduped.length - kept.length) },
  };
}

/** A stateful, per-scan budget. Create ONE and pass it to every run() in that scan. */
export class CostGuard {
  private used = 0;
  constructor(private readonly maxCalls: number) {
    if (!Number.isFinite(maxCalls) || maxCalls < 0) {
      throw new Error(`CostGuard requires a non-negative maxCalls, got ${maxCalls}`);
    }
  }

  /** Try to reserve `n` live calls. Returns false (reserving nothing) if it would exceed. */
  tryConsume(n = 1): boolean {
    if (this.used + n > this.maxCalls) return false;
    this.used += n;
    return true;
  }

  get consumed(): number {
    return this.used;
  }

  get remaining(): number {
    return Math.max(0, this.maxCalls - this.used);
  }

  get limit(): number {
    return this.maxCalls;
  }
}

function clampInt(raw: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
