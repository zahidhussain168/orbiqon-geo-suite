/**
 * @orbiqon/query-engine — "ask the AIs and read the answer."
 *
 * Framework-agnostic core reused by every tool in the Orbiqon GEO Suite. It queries each AI
 * engine N times for a prompt and reports a citation RATE per engine (never a fake yes/no).
 * Brand-awareness is injected by the caller via a MentionDetector (the Entity Resolver provides
 * one), so this package has zero dependency on how "was our brand cited?" is decided.
 */
export { QueryEngine, type QueryEngineConfig } from './engine.js';
export {
  createProviders,
  DEFAULT_ENGINES,
  type CreateProvidersOptions,
} from './providers/index.js';
export {
  type Provider,
  type ProviderQueryOptions,
  extractUrls,
} from './providers/types.js';
export { MockProvider, type MockConfig } from './providers/mock.js';
export { InMemoryCache, cacheKey, utcDay, type Cache } from './cache.js';
export {
  CostGuard,
  clampScanInputs,
  limitsFromEnv,
  samplesFromEnv,
  DEFAULT_MAX_PROMPTS,
  DEFAULT_MAX_SAMPLES,
  DEFAULT_SAMPLES,
  type ScanLimits,
  type ClampedInputs,
} from './cost-guard.js';
export { sampleEngine, type SampleEngineOptions, type SampleEngineOutcome } from './sampling.js';
export * from './types.js';
