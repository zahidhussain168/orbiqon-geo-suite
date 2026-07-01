import type { EngineSummary } from './types';

/**
 * Transparent 0–100 visibility score.
 *
 * Product logic (kept in the app, not the reusable core). The score blends three signals per
 * engine and averages across the engines we actually queried:
 *
 *   engineScore = citationRate × positionFactor
 *     citationRate  — how often the brand was named (0–1); this is the honest sampled rate.
 *     positionFactor — how high it ranked when named: rank 1 = 1.0, decaying 0.15 per rank,
 *                      floored at 0.3. Unknown rank (cited but unranked) = 0.7.
 *
 *   score = round(100 × mean(engineScore over eligible engines))
 *
 * Eligible engines = those that returned at least one successful sample (mock or live). Stubbed
 * "coming soon" surfaces don't drag the score down — they simply aren't counted.
 */
export function computeVisibilityScore(engines: EngineSummary[]): number {
  const eligible = engines.filter((e) => e.status === 'ok' && e.sampleCount > 0);
  if (eligible.length === 0) return 0;

  const total = eligible.reduce((sum, e) => sum + engineScore(e), 0);
  return Math.round((100 * total) / eligible.length);
}

function engineScore(e: EngineSummary): number {
  if (e.citationRate <= 0) return 0;
  return e.citationRate * positionFactor(e.avgPosition);
}

function positionFactor(avgPosition: number | null): number {
  if (avgPosition == null) return 0.7; // cited but rank unknown
  return Math.max(0.3, 1 - (avgPosition - 1) * 0.15);
}
