/**
 * Types for the Entity Resolver — "did they mean us?".
 *
 * These are intentionally *structurally compatible* with the Query Engine's `MentionSignal`
 * (cited/position/sentiment/competitors) so a resolver can be handed straight to
 * `QueryEngine.run({ detectMention })` without either package importing the other.
 */

export type Sentiment = 'positive' | 'neutral' | 'negative';

/** One occurrence of a matched brand in the text. */
export interface Mention {
  /** The exact substring that matched. */
  text: string;
  /** Character index of the match. */
  index: number;
  /** Which term matched (the brand or one of its aliases), normalized. */
  matchedTerm: string;
}

export interface ResolveOptions {
  /** Extra names/nicknames that also count as the brand (e.g. "monday" for "Monday.com"). */
  aliases?: string[];
  /** Known competitor names — improves competitor extraction precision when provided. */
  competitors?: string[];
  /** URLs the answer cited; passed straight through to the result. */
  citations?: string[];
  /**
   * Optional case-insensitive substring match as a fallback. Off by default because it causes
   * false positives (e.g. "Monday" the weekday). Use aliases for controlled nicknames instead.
   */
  looseMatch?: boolean;
}

export interface ResolveResult {
  /** Was the tracked brand named? */
  cited: boolean;
  /** 1-based rank of the brand among all named brands (1 = named first), or null. */
  position: number | null;
  /** Sentiment of the brand mention (neutral when uncited or unclear). */
  sentiment: Sentiment | null;
  /** Other brands named in the answer, in order of first appearance. */
  competitors: string[];
  /** Every matched occurrence of the tracked brand. */
  mentions: Mention[];
  /** URLs cited by the answer (passed through from options). */
  citations: string[];
}

/**
 * The minimal shape the resolver reads from an answer. A Query Engine `RawAnswer` satisfies this,
 * so `(answer) => resolver.resolve(answer.text, brand, { citations: answer.citations })` is a valid
 * `MentionDetector` without any cross-package type dependency.
 */
export interface AnswerLike {
  text: string;
  citations?: string[];
}
