import { InMemoryCache, type Cache } from './cache.js';
import { samplesFromEnv, type CostGuard } from './cost-guard.js';
import type { Provider } from './providers/types.js';
import { sampleEngine } from './sampling.js';
import type { Logger, RunOptions, RunResult } from './types.js';

export interface QueryEngineConfig {
  /** Engines to query, in display order. Build these with `createProviders`. */
  providers: Provider[];
  /** Default samples per (engine × prompt). Falls back to env / 3. */
  samples?: number;
  /** Cache for live answers. Defaults to a process-local in-memory cache. */
  cache?: Cache;
  /** Optional shared budget across an entire scan (many prompts). */
  costGuard?: CostGuard;
  logger?: Logger;
}

/**
 * The heart of the suite: given a prompt, ask every configured engine N times and report a
 * citation RATE per engine (never a fake yes/no). Brand-unaware — pass a `detectMention`
 * function (from the Entity Resolver) to score whether the tracked brand was cited.
 */
export class QueryEngine {
  private readonly providers: Provider[];
  private readonly cache: Cache;
  private readonly defaultSamples: number;
  private readonly costGuard?: CostGuard;
  private readonly logger?: Logger;

  constructor(config: QueryEngineConfig) {
    this.providers = config.providers;
    this.cache = config.cache ?? new InMemoryCache();
    this.defaultSamples = config.samples ?? samplesFromEnv();
    this.costGuard = config.costGuard;
    this.logger = config.logger;
  }

  /** Run one prompt across all configured engines. */
  async run(prompt: string, options: RunOptions = {}): Promise<RunResult> {
    const samples = options.samples ?? this.defaultSamples;
    const outcomes = await Promise.all(
      this.providers.map((provider) =>
        sampleEngine(provider, prompt, {
          samples,
          detector: options.detectMention,
          cache: this.cache,
          costGuard: this.costGuard,
          model: options.models?.[provider.name],
          signal: options.signal,
          logger: this.logger,
        }),
      ),
    );

    return {
      prompt,
      engines: outcomes.map((o) => o.result),
      meta: {
        samples,
        liveCalls: sum(outcomes.map((o) => o.liveCalls)),
        cachedCalls: sum(outcomes.map((o) => o.cachedCalls)),
        cappedCalls: sum(outcomes.map((o) => o.cappedCalls)),
      },
    };
  }

  /** Convenience: run many prompts sharing one cost budget. */
  async runMany(prompts: string[], options: RunOptions = {}): Promise<RunResult[]> {
    const results: RunResult[] = [];
    for (const prompt of prompts) {
      results.push(await this.run(prompt, options));
    }
    return results;
  }
}

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
