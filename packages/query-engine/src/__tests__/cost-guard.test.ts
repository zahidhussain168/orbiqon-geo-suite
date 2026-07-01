import { describe, expect, it } from 'vitest';
import { clampScanInputs, CostGuard, limitsFromEnv } from '../cost-guard.js';

describe('CostGuard', () => {
  it('reserves up to the limit then refuses', () => {
    const guard = new CostGuard(3);
    expect(guard.tryConsume(1)).toBe(true);
    expect(guard.tryConsume(2)).toBe(true);
    expect(guard.tryConsume(1)).toBe(false); // would exceed
    expect(guard.consumed).toBe(3);
    expect(guard.remaining).toBe(0);
  });

  it('rejects a negative budget', () => {
    expect(() => new CostGuard(-1)).toThrow();
  });
});

describe('clampScanInputs', () => {
  it('caps prompts and samples and dedupes', () => {
    const limits = { maxPrompts: 5, maxSamples: 5 };
    const prompts = ['a', 'A', 'b', 'c', 'd', 'e', 'f', 'g'];
    const clamped = clampScanInputs(prompts, 10, limits);
    expect(clamped.prompts).toHaveLength(5); // capped
    expect(clamped.prompts).not.toContain('A'); // deduped (case-insensitive)
    expect(clamped.samples).toBe(5); // capped to maxSamples
    expect(clamped.maxCalls).toBe(25);
    expect(clamped.dropped.prompts).toBeGreaterThan(0);
  });
});

describe('limitsFromEnv', () => {
  it('falls back to defaults for missing/invalid values', () => {
    expect(limitsFromEnv({})).toEqual({ maxPrompts: 5, maxSamples: 5 });
    expect(limitsFromEnv({ MAX_PROMPTS: 'x', MAX_SAMPLES: '3' })).toEqual({
      maxPrompts: 5,
      maxSamples: 3,
    });
  });
});
