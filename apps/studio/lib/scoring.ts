import type { EngineSummary } from './types';

/**
 * Transparent 0-100 visibility score.
 *
 * Product logic (kept in the app, not the reusable core). Per engine we blend two honest signals,
 * then average across the engines we actually queried:
 *
 *   engineScore = citationRate * (BASE + (1 - BASE) * positionFactor)
 *     citationRate  , how often the brand was named across samples (0-1). This is the dominant
 *                     signal: a brand cited by every engine every time should read as well cited.
 *     positionFactor, how high it ranked when named, a gentle modifier (not a cliff): rank 1 = 1.0,
 *                     decaying 0.08 per rank, floored at 0.25. Unknown rank (cited but unranked) = 0.75.
 *
 *   score = round(100 * mean(engineScore over eligible engines))
 *
 * With BASE = 0.6, position swings each engine's score between 60% and 100% of its citation rate,
 * so being cited matters most and ranking refines it. Eligible engines returned at least one
 * successful sample (mock or live). Stubbed "coming soon" surfaces are not counted.
 */
const BASE = 0.6;

export function computeVisibilityScore(engines: EngineSummary[]): number {
  const eligible = engines.filter((e) => e.status === 'ok' && e.sampleCount > 0);
  if (eligible.length === 0) return 0;

  const total = eligible.reduce((sum, e) => sum + engineScore(e), 0);
  return Math.round((100 * total) / eligible.length);
}

function engineScore(e: EngineSummary): number {
  if (e.citationRate <= 0) return 0;
  return e.citationRate * (BASE + (1 - BASE) * positionFactor(e.avgPosition));
}

function positionFactor(avgPosition: number | null): number {
  if (avgPosition == null) return 0.75; // cited but rank unknown
  return Math.max(0.25, 1 - (avgPosition - 1) * 0.08);
}
