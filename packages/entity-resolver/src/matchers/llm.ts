import type { ResolveResult } from '../types.js';

/**
 * Optional LLM-assisted disambiguation strategy. Kept as an injectable interface so the package
 * stays dependency-light and fully testable offline — the default resolver never calls an LLM.
 * A tool that wants higher-accuracy matching can pass an implementation that, e.g., asks a model
 * "in this answer, does 'Apple' refer to Apple Inc. or the fruit?".
 */
export interface LlmMatcher {
  /**
   * Refine a heuristic result. Given the answer text, the tracked brand, and the heuristic result,
   * return a (possibly corrected) result. Implementations may be async.
   */
  refine(text: string, brand: string, heuristic: ResolveResult): ResolveResult | Promise<ResolveResult>;
}

/** A no-op matcher: returns the heuristic result unchanged. */
export const passthroughMatcher: LlmMatcher = {
  refine: (_text, _brand, heuristic) => heuristic,
};
