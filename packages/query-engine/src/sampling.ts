import { cacheKey, type Cache } from './cache.js';
import type { CostGuard } from './cost-guard.js';
import type { Provider } from './providers/types.js';
import {
  ENGINE_META,
  NotImplementedError,
  type EngineSample,
  type Logger,
  type MentionDetector,
  type RawAnswer,
  type SampledResult,
} from './types.js';

export interface SampleEngineOptions {
  samples: number;
  detector?: MentionDetector;
  cache?: Cache;
  costGuard?: CostGuard;
  model?: string;
  signal?: AbortSignal;
  logger?: Logger;
}

export interface SampleEngineOutcome {
  result: SampledResult;
  liveCalls: number;
  cachedCalls: number;
  cappedCalls: number;
}

/**
 * Sample one engine `samples` times for one prompt, honoring the cache (free) and the cost
 * guard (which only limits *live* calls). Failures never throw — they're captured per sample
 * so one flaky engine can't sink the whole scan.
 */
export async function sampleEngine(
  provider: Provider,
  prompt: string,
  opts: SampleEngineOptions,
): Promise<SampleEngineOutcome> {
  const model = opts.model ?? provider.defaultModel;
  const samples: EngineSample[] = [];
  let liveCalls = 0;
  let cachedCalls = 0;
  let cappedCalls = 0;

  for (let i = 0; i < opts.samples; i++) {
    // Cache first — a cache hit is free and bypasses the budget entirely.
    const key = cacheKey(provider.name, model, prompt);
    const cached = provider.kind === 'api' ? await opts.cache?.get(key) : undefined;

    let answer: RawAnswer | undefined = cached ?? undefined;
    let fromCache = Boolean(cached);

    if (!answer) {
      // Live call — but only if the budget allows (mock/stub calls are free too, so we only
      // charge the guard for real API providers).
      const charges = provider.kind === 'api';
      if (charges && opts.costGuard && !opts.costGuard.tryConsume(1)) {
        cappedCalls++;
        opts.logger?.warn?.(`Cost cap reached; skipping ${provider.name} sample ${i + 1}`);
        continue;
      }

      try {
        answer = await provider.query(prompt, { model, signal: opts.signal });
        if (charges) {
          liveCalls++;
          await opts.cache?.set(key, answer);
        }
      } catch (err) {
        samples.push(errorSample(i, err));
        continue;
      }
    } else {
      cachedCalls++;
    }

    samples.push(await toSample(i, answer, fromCache, opts.detector));
  }

  return {
    result: aggregate(provider, samples),
    liveCalls,
    cachedCalls,
    cappedCalls,
  };
}

async function toSample(
  index: number,
  answer: RawAnswer,
  cached: boolean,
  detector?: MentionDetector,
): Promise<EngineSample> {
  let cited: boolean | null = null;
  let position: number | null = null;
  let sentiment: EngineSample['sentiment'] = null;
  let competitors: string[] = [];

  if (detector) {
    const signal = await detector(answer);
    cited = signal.cited;
    position = signal.position ?? null;
    sentiment = signal.sentiment ?? null;
    competitors = signal.competitors ?? [];
  }

  return {
    index,
    status: 'ok',
    cited,
    position,
    sentiment,
    competitors,
    citations: answer.citations,
    text: answer.text,
    model: answer.model,
    cached,
  };
}

function errorSample(index: number, err: unknown): EngineSample {
  const isNotImpl = err instanceof NotImplementedError;
  return {
    index,
    status: isNotImpl ? 'not_implemented' : 'error',
    cited: null,
    position: null,
    sentiment: null,
    competitors: [],
    citations: [],
    text: '',
    model: '',
    cached: false,
    error: err instanceof Error ? err.message : String(err),
  };
}

function aggregate(provider: Provider, samples: EngineSample[]): SampledResult {
  const ok = samples.filter((s) => s.status === 'ok');
  const cited = ok.filter((s) => s.cited === true);
  const positions = cited.map((s) => s.position).filter((p): p is number => typeof p === 'number');
  const competitors = unique(ok.flatMap((s) => s.competitors));
  const citations = unique(ok.flatMap((s) => s.citations));

  let status: SampledResult['status'] = 'ok';
  if (ok.length === 0) {
    status = samples.every((s) => s.status === 'not_implemented') ? 'not_implemented' : 'error';
  }

  return {
    engine: provider.name,
    displayName: ENGINE_META[provider.name].displayName,
    configured: provider.isConfigured(),
    kind: provider.kind,
    status,
    samples,
    citedCount: cited.length,
    sampleCount: ok.length,
    citationRate: ok.length === 0 ? 0 : cited.length / ok.length,
    bestPosition: positions.length ? Math.min(...positions) : null,
    avgPosition: positions.length ? positions.reduce((a, b) => a + b, 0) / positions.length : null,
    competitors,
    citations,
  };
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
}
