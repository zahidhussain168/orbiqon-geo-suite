import { describe, expect, it } from 'vitest';
import { cacheKey, InMemoryCache } from '../cache.js';
import type { RawAnswer } from '../types.js';

const answer: RawAnswer = { engine: 'claude', text: 'hi', citations: [], model: 'm' };

describe('cacheKey', () => {
  it('is stable across whitespace/case and isolates by day + engine + model', () => {
    expect(cacheKey('claude', 'm', 'Best  CRM', '2026-07-01')).toBe(
      cacheKey('claude', 'm', 'best crm', '2026-07-01'),
    );
    expect(cacheKey('claude', 'm', 'best crm', '2026-07-01')).not.toBe(
      cacheKey('claude', 'm', 'best crm', '2026-07-02'),
    );
    expect(cacheKey('claude', 'm', 'x', '2026-07-01')).not.toBe(
      cacheKey('chatgpt', 'm', 'x', '2026-07-01'),
    );
  });
});

describe('InMemoryCache', () => {
  it('stores and retrieves by key', () => {
    const cache = new InMemoryCache();
    const key = cacheKey('claude', 'm', 'best crm', '2026-07-01');
    expect(cache.get(key)).toBeUndefined();
    cache.set(key, answer);
    expect(cache.get(key)).toEqual(answer);
    expect(cache.size).toBe(1);
  });
});
