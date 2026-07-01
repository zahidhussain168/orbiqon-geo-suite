import type { EngineName, RawAnswer } from '../types.js';
import { ENGINE_META } from '../types.js';
import type { Provider, ProviderQueryOptions } from './types.js';

/**
 * Deterministic offline provider. Given the same (engine, prompt, brand) it always produces
 * the same answer, so the whole vertical slice runs with zero external dependencies and tests
 * are stable. It optionally weaves the tracked brand into some answers so the demo shows a
 * realistic mix of "cited" and "not cited".
 */
export interface MockConfig {
  /** The tracked brand — woven into a deterministic fraction of answers. */
  brand?: string;
  /** Probability [0..1] that a given (engine, prompt) names the brand. */
  mentionProbability?: number;
  /** Competitor names to sprinkle into answers. */
  competitors?: string[];
  /** Extra entropy so different engines phrase things differently. */
  seed?: string;
}

const DEFAULT_COMPETITORS = [
  'Notion',
  'Asana',
  'Monday.com',
  'ClickUp',
  'Trello',
  'Linear',
  'Airtable',
  'Basecamp',
];

export class MockProvider implements Provider {
  readonly kind = 'mock' as const;
  readonly displayName: string;
  readonly defaultModel = 'mock-1';

  constructor(
    readonly name: EngineName,
    private readonly config: MockConfig = {},
  ) {
    this.displayName = `${ENGINE_META[name].displayName} (mock)`;
  }

  isConfigured(): boolean {
    return false;
  }

  async query(prompt: string, _opts?: ProviderQueryOptions): Promise<RawAnswer> {
    const brand = this.config.brand?.trim();
    const mentionProb = this.config.mentionProbability ?? 0.5;
    const pool = this.config.competitors?.length ? this.config.competitors : DEFAULT_COMPETITORS;
    const seed = `${this.config.seed ?? ''}:${this.name}:${prompt}:${brand ?? ''}`;

    // Deterministic picks derived from the seed.
    const nameBrand = brand ? rand(seed + ':brand') < mentionProb : false;
    const picks = pickN(pool.filter((c) => c.toLowerCase() !== brand?.toLowerCase()), 3, seed + ':comp');

    const ordered: string[] = [];
    if (nameBrand && brand) {
      // Insert the brand at a deterministic rank among the picks.
      const rank = Math.floor(rand(seed + ':rank') * (picks.length + 1));
      ordered.push(...picks.slice(0, rank), brand, ...picks.slice(rank));
    } else {
      ordered.push(...picks);
    }

    const text = renderAnswer(prompt, ordered);
    const citations = ordered.map((b) => `https://example.com/${slug(b)}`);

    return {
      engine: this.name,
      text,
      citations,
      model: this.defaultModel,
      raw: { mock: true, nameBrand, ordered },
    };
  }
}

function renderAnswer(prompt: string, brands: string[]): string {
  const lead = `For "${prompt.replace(/"/g, "'")}", a few strong options stand out.`;
  const lines = brands.map(
    (b, i) => `${i + 1}. ${b} — a popular choice (https://example.com/${slug(b)}).`,
  );
  return [lead, '', ...lines, '', 'Your best pick depends on team size and budget.'].join('\n');
}

// ── deterministic helpers ────────────────────────────────────────────────────
/** FNV-1a hash → float in [0,1). Stable, dependency-free. */
function rand(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // >>> 0 to unsigned, then scale.
  return (h >>> 0) / 0xffffffff;
}

function pickN(pool: string[], n: number, seed: string): string[] {
  const scored = pool.map((item, i) => ({ item, score: rand(`${seed}:${i}:${item}`) }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, n).map((s) => s.item);
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
