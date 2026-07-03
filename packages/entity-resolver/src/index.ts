/**
 * @orbiqon/entity-resolver — "did they mean us?".
 *
 * Framework-agnostic brand matching reused across the Orbiqon GEO Suite. Turns an AI answer +
 * a tracked brand into: was it cited, at what rank, with what sentiment, and who was named instead.
 * Structurally compatible with the Query Engine's MentionDetector — no cross-package dependency.
 */
export { EntityResolver } from './resolver.js';
export { extractBrands, extractUrls, type ExtractedBrand } from './extract.js';
export { canonicalKey, foldFamilies } from './canonical.js';
export {
  normalize,
  domainRoot,
  expandTerms,
  editDistance,
  isFuzzyMatch,
  escapeRegExp,
} from './matchers/fuzzy.js';
export { passthroughMatcher, type LlmMatcher } from './matchers/llm.js';
export type { AnswerLike, Mention, ResolveOptions, ResolveResult, Sentiment } from './types.js';
