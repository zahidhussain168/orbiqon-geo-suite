import type { EngineName, RawAnswer } from './types.js';

/**
 * Pluggable cache. The expensive thing is the live API call, so we cache the {@link RawAnswer}
 * keyed by (engine, model, prompt, day). A repeated brand/prompt on the same day must not
 * re-hit the APIs. Local mention-detection is cheap and re-runs on the cached text.
 *
 * Swap {@link InMemoryCache} for Redis/DB later by implementing this interface.
 */
export interface Cache {
  get(key: string): Promise<RawAnswer | undefined> | RawAnswer | undefined;
  set(key: string, value: RawAnswer): Promise<void> | void;
}

/** Build the canonical cache key. `day` isolates entries to a UTC date bucket. */
export function cacheKey(engine: EngineName, model: string, prompt: string, day = utcDay()): string {
  return `${day}:${engine}:${model}:${normalizePrompt(prompt)}`;
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
