/**
 * Core types for the Query Engine.
 *
 * The Query Engine is deliberately *brand-unaware*: a provider is handed a prompt and
 * returns a raw answer. Deciding "was our brand cited?" is the job of a caller-injected
 * {@link MentionDetector} (the Entity Resolver package provides one). This keeps the two
 * core packages decoupled — query-engine has zero dependency on entity-resolver.
 */

/** The AI answer surfaces we can query. */
export type EngineName =
  | 'chatgpt' // OpenAI API (approximates ChatGPT answers)
  | 'claude' // Anthropic API
  | 'gemini' // Google Gemini API
  | 'perplexity' // Perplexity API
  | 'google-ai-overviews' // stub — headless scraping deferred
  | 'chatgpt-web'; // stub — headless scraping deferred

export type EngineKind = 'api' | 'scrape-stub' | 'mock';

export type Sentiment = 'positive' | 'neutral' | 'negative';

/** A single raw answer from one engine for one prompt. */
export interface RawAnswer {
  engine: EngineName;
  /** The full answer text. */
  text: string;
  /** URLs the answer cited/linked, best-effort extracted by the provider. */
  citations: string[];
  /** The concrete model id used (e.g. "gpt-4o"). */
  model: string;
  /** Provider-specific raw payload, for debugging. Not part of the stable contract. */
  raw?: unknown;
}

/** What a {@link MentionDetector} reports about one answer. */
export interface MentionSignal {
  /** Was the tracked brand named in this answer? */
  cited: boolean;
  /** 1-based position of the brand among named brands (1 = first), or null. */
  position?: number | null;
  /** Sentiment of the mention. */
  sentiment?: Sentiment | null;
  /** Other brands named in the answer (the "who got named instead" reveal). */
  competitors?: string[];
}

/**
 * Injected by the caller to turn a raw answer into a citation signal for a specific brand.
 * Synchronous or async. If not provided, samples carry `cited: null`.
 */
export type MentionDetector = (answer: RawAnswer) => MentionSignal | Promise<MentionSignal>;

/** The status of a single sample run. */
export type SampleStatus = 'ok' | 'not_implemented' | 'error';

/** One sample (one call) of one engine for one prompt. */
export interface EngineSample {
  index: number;
  status: SampleStatus;
  /** null when no detector was provided or the sample failed. */
  cited: boolean | null;
  position: number | null;
  sentiment: Sentiment | null;
  competitors: string[];
  citations: string[];
  text: string;
  model: string;
  /** Whether this sample was served from cache (no live API call). */
  cached: boolean;
  error?: string;
}

/** Aggregated result for one engine across all samples of one prompt. */
export interface SampledResult {
  engine: EngineName;
  displayName: string;
  /** Whether the engine had real credentials (false ⇒ mock or unconfigured). */
  configured: boolean;
  kind: EngineKind;
  /** Rolled-up status: 'ok' if any sample ok, else 'not_implemented' or 'error'. */
  status: 'ok' | 'not_implemented' | 'error';
  samples: EngineSample[];
  /** Number of samples in which the brand was cited. */
  citedCount: number;
  /** Number of successful samples (denominator for the rate). */
  sampleCount: number;
  /** citedCount / sampleCount, 0 when no successful samples. Honest RATE, never yes/no. */
  citationRate: number;
  bestPosition: number | null;
  avgPosition: number | null;
  /** Union of competitors named across samples. */
  competitors: string[];
  /** Union of cited URLs across samples. */
  citations: string[];
}

/** Options for a single {@link QueryEngine.run} call (one prompt). */
export interface RunOptions {
  /** Detector that decides whether the tracked brand was cited. */
  detectMention?: MentionDetector;
  /** Override sample count for this run (still clamped by the cost guard). */
  samples?: number;
  /** Per-engine model overrides. */
  models?: Partial<Record<EngineName, string>>;
  /** Abort in-flight calls. */
  signal?: AbortSignal;
}

/** Result of running one prompt across all configured engines. */
export interface RunResult {
  prompt: string;
  engines: SampledResult[];
  meta: {
    samples: number;
    /** Live API calls actually made. */
    liveCalls: number;
    /** Calls served from cache. */
    cachedCalls: number;
    /** Calls skipped because the per-scan budget was exhausted. */
    cappedCalls: number;
  };
}

/** Minimal logger interface so the package doesn't hard-depend on console. */
export interface Logger {
  debug?(msg: string, meta?: unknown): void;
  warn?(msg: string, meta?: unknown): void;
  error?(msg: string, meta?: unknown): void;
}

/** Display metadata for each engine surface. */
export const ENGINE_META: Record<EngineName, { displayName: string; kind: EngineKind }> = {
  chatgpt: { displayName: 'ChatGPT', kind: 'api' },
  claude: { displayName: 'Claude', kind: 'api' },
  gemini: { displayName: 'Gemini', kind: 'api' },
  perplexity: { displayName: 'Perplexity', kind: 'api' },
  'google-ai-overviews': { displayName: 'Google AI Overviews', kind: 'scrape-stub' },
  'chatgpt-web': { displayName: 'ChatGPT (web)', kind: 'scrape-stub' },
};

/** Thrown by stubbed surfaces; the engine catches it and marks the sample not_implemented. */
export class NotImplementedError extends Error {
  readonly code = 'not_implemented' as const;
  constructor(engine: EngineName) {
    super(`Engine "${engine}" is not implemented yet (headless scraping deferred).`);
    this.name = 'NotImplementedError';
  }
}
