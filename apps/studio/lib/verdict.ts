/**
 * Verdict labels are factual, not alarmist. Kept in a plain (no 'use client') module so it can
 * be imported from server-only code, such as the report email renderer, without pulling in
 * ScoreGauge's client boundary. Single source of truth for the thresholds and colors used by
 * both the on-screen UI and the emailed report.
 */
export function scoreVerdict(score: number): { color: string; verdict: string } {
  if (score >= 66) return { color: '#3FB950', verdict: 'Well cited' };
  if (score >= 33) return { color: '#E2A336', verdict: 'Partially visible' };
  return { color: '#EB5757', verdict: 'Mostly invisible to AI' };
}
