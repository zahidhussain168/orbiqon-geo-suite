import { describe, expect, it } from 'vitest';
import { QueryEngine } from '../engine.js';
import { createProviders } from '../providers/index.js';
import { CostGuard } from '../cost-guard.js';
import type { MentionDetector } from '../types.js';

// A trivial detector: brand is "cited" if its name appears in the answer text.
function detectorFor(brand: string): MentionDetector {
  return (answer) => {
    const idx = answer.text.toLowerCase().indexOf(brand.toLowerCase());
    return { cited: idx >= 0, position: idx >= 0 ? 1 : null };
  };
}

describe('QueryEngine (mock mode)', () => {
  it('runs all engines and reports a rate, never a boolean', async () => {
    const providers = createProviders({ forceMock: true, mock: { brand: 'Notion' } });
    const engine = new QueryEngine({ providers, samples: 3 });

    const result = await engine.run('best note app', { detectMention: detectorFor('Notion') });

    // 4 API (mocked) + 2 stubs
    expect(result.engines).toHaveLength(6);
    for (const eng of result.engines.filter((e) => e.kind === 'mock')) {
      expect(eng.sampleCount).toBe(3);
      expect(eng.citationRate).toBeGreaterThanOrEqual(0);
      expect(eng.citationRate).toBeLessThanOrEqual(1);
    }
  });

  it('marks stubbed surfaces as not_implemented without throwing the run', async () => {
    const providers = createProviders({ forceMock: true });
    const engine = new QueryEngine({ providers, samples: 2 });
    const result = await engine.run('best CRM');

    const overviews = result.engines.find((e) => e.engine === 'google-ai-overviews');
    expect(overviews?.status).toBe('not_implemented');
    const web = result.engines.find((e) => e.engine === 'chatgpt-web');
    expect(web?.status).toBe('not_implemented');
  });

  it('is deterministic for the same (engine, prompt, brand)', async () => {
    const make = () =>
      new QueryEngine({
        providers: createProviders({ forceMock: true, mock: { brand: 'Linear' } }),
        samples: 4,
      });
    const a = await make().run('best pm tool', { detectMention: detectorFor('Linear') });
    const b = await make().run('best pm tool', { detectMention: detectorFor('Linear') });

    const rate = (r: typeof a) => r.engines.find((e) => e.engine === 'claude')?.citationRate;
    expect(rate(a)).toBe(rate(b));
  });

  it('reports cited counts as a fraction of successful samples', async () => {
    const providers = createProviders({
      forceMock: true,
      mock: { brand: 'Notion', mentionProbability: 1 },
    });
    const engine = new QueryEngine({ providers, samples: 3 });
    const result = await engine.run('note apps', { detectMention: detectorFor('Notion') });
    const claude = result.engines.find((e) => e.engine === 'claude');
    expect(claude?.citedCount).toBe(3);
    expect(claude?.citationRate).toBe(1);
  });
});

describe('CostGuard integration', () => {
  it('does not charge the budget for mock/stub engines', async () => {
    const guard = new CostGuard(0); // zero live-call budget
    const providers = createProviders({ forceMock: true, mock: { brand: 'Notion' } });
    const engine = new QueryEngine({ providers, samples: 3, costGuard: guard });
    const result = await engine.run('note apps', { detectMention: detectorFor('Notion') });
    // Mock providers are free, so sampling still happened despite a 0 budget.
    expect(result.meta.liveCalls).toBe(0);
    expect(result.meta.cappedCalls).toBe(0);
    const claude = result.engines.find((e) => e.engine === 'claude');
    expect(claude?.sampleCount).toBe(3);
  });
});
