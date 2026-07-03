import type { EngineName, RawAnswer } from './types.js';

/**
 * Pluggable cache. The expensive thing is the live API call, so we cache the {@link RawAnswer}
 * keyed by (engine, model, prompt, day, sampleIndex). The sample index is part of the key on
 * purpose: within a scan each sample must be an independent call so we capture real run-to-run
 * variance (the whole point of sampling), while a repeated identical scan on the same day still
 * reuses those exact varied answers instead of re-billing.
 *
 * Swap {@link InMemoryCache} for Redis/DB later by implementing this interface.
 */
export interface Cache {
  get(key: string): Promise<RawAnswer | undefined> | RawAnswer | undefined;
  set(key: string, value: RawAnswer): Promise<void> | void;
}

/** Build the canonical cache key. `day` isolates entries to a UTC date bucket; `sampleIndex`
 * keeps the N samples of one prompt distinct so they are genuinely independent calls. */
export function cacheKey(
  engine: EngineName,
  model: string,
  prompt: string,
  day = utcDay(),
  sampleIndex = 0,
): string {
  return `${day}:${engine}:${model}:${sampleIndex}:${normalizePrompt(prompt)}`;
}

/** Current UTC date as YYYY-MM-DD. */
export function utcDay(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function normalizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Simple process-local cache. Fine for a single Node process / dev; not shared across pods. */
export class InMemoryCache implements Cache {
  private readonly store = new Map<string, RawAnswer>();

  get(key: string): RawAnswer | undefined {
    return this.store.get(key);
  }

  set(key: string, value: RawAnswer): void {
    this.store.set(key, value);
  }

  get size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}
