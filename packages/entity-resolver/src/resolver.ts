import { extractBrands, extractUrls } from './extract.js';
import {
  domainRoot,
  escapeRegExp,
  expandTerms,
  isFuzzyMatch,
  normalize,
} from './matchers/fuzzy.js';
import type { AnswerLike, Mention, ResolveOptions, ResolveResult, Sentiment } from './types.js';

const POSITIVE = new Set([
  'best',
  'great',
  'excellent',
  'top',
  'recommended',
  'popular',
  'powerful',
  'favorite',
  'love',
  'strong',
  'leading',
  'ideal',
  'perfect',
]);
const NEGATIVE = new Set([
  'worst',
  'bad',
  'poor',
  'weak',
  'avoid',
  'limited',
  'lacking',
  'overpriced',
  'clunky',
  'dated',
  'buggy',
]);

/**
 * The Entity Resolver: given an AI answer and a tracked brand, decides whether the brand was
 * cited, where it ranked among named brands, its sentiment, and which competitors were named.
 * Pure and offline; an optional {@link LlmMatcher} can refine the heuristic result.
 */
export class EntityResolver {
  /** Resolve from an {@link AnswerLike} object (convenience for use as a MentionDetector). */
  resolveAnswer(answer: AnswerLike, brand: string, opts: ResolveOptions = {}): ResolveResult {
    return this.resolve(answer.text, brand, { citations: answer.citations, ...opts });
  }

  resolve(text: string, brand: string, opts: ResolveOptions = {}): ResolveResult {
    const terms = expandTerms(brand, opts.aliases);
    const mentions = this.findMentions(text, terms, opts.looseMatch ?? false);

    const known = [brand, ...(opts.aliases ?? []), ...(opts.competitors ?? [])];
    const extracted = extractBrands(text, known);

    // Split extracted brands into "us" vs competitors.
    const isUs = (name: string) => this.isSameBrand(name, terms);
    const ordered = [...extracted];

    // If we matched the brand but the heuristic extractor missed it, splice in a synthetic entry
    // at the first mention so ranking still works.
    const cited = mentions.length > 0;
    if (cited && !ordered.some((b) => isUs(b.name))) {
      const first = mentions[0]!;
      ordered.push({ name: first.text, index: first.index });
      ordered.sort((a, b) => a.index - b.index);
    }

    const usIndex = ordered.findIndex((b) => isUs(b.name));
    const position = cited && usIndex >= 0 ? usIndex + 1 : null;
    const competitors = ordered.filter((b) => !isUs(b.name)).map((b) => b.name);

    const sentiment = cited ? this.sentimentAround(text, mentions[0]!.index) : null;

    return {
      cited,
      position,
      sentiment,
      competitors,
      mentions,
      citations: opts.citations ?? extractUrls(text),
    };
  }

  /** Find every occurrence of the brand or its aliases (word-boundaried), plus fuzzy near-misses. */
  private findMentions(text: string, terms: string[], loose: boolean): Mention[] {
    const mentions: Mention[] = [];
    const seen = new Set<number>();

    for (const term of terms) {
      const re = new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(term)}(?![A-Za-z0-9])`, 'gi');
      for (const m of text.matchAll(re)) {
        if (m.index != null && !seen.has(m.index)) {
          seen.add(m.index);
          mentions.push({ text: m[0] ?? term, index: m.index, matchedTerm: term });
        }
      }
      if (loose) {
        const idx = text.toLowerCase().indexOf(term);
        if (idx >= 0 && !seen.has(idx)) {
          seen.add(idx);
          mentions.push({ text: text.slice(idx, idx + term.length), index: idx, matchedTerm: term });
        }
      }
    }

    // Fuzzy pass for misspellings of longer terms.
    const longTerms = terms.filter((t) => t.length >= 5 && !t.includes(' '));
    if (longTerms.length) {
      for (const m of text.matchAll(/\b[A-Za-z][A-Za-z0-9]{3,}\b/g)) {
        const token = m[0] ?? '';
        if (m.index == null || seen.has(m.index)) continue;
        if (longTerms.some((t) => isFuzzyMatch(token, t) && normalize(token) !== t)) {
          seen.add(m.index);
          mentions.push({ text: token, index: m.index, matchedTerm: 'fuzzy' });
        }
      }
    }

    return mentions.sort((a, b) => a.index - b.index);
  }

  /** True when an extracted candidate name refers to the tracked brand (handles domain vs name). */
  private isSameBrand(candidate: string, terms: string[]): boolean {
    const c = normalize(candidate);
    const cRoot = domainRoot(candidate);
    for (const term of terms) {
      if (c === term) return true;
      const tRoot = domainRoot(term);
      if (cRoot && cRoot === term) return true; // "notion.so" vs "notion"
      if (tRoot && tRoot === c) return true; // "notion" vs "notion.so"
      if (cRoot && tRoot && cRoot === tRoot) return true;
    }
    return false;
  }

  private sentimentAround(text: string, index: number, window = 80): Sentiment {
    const slice = normalize(text.slice(Math.max(0, index - window), index + window));
    const words = slice.split(/[^a-z]+/);
    let score = 0;
    for (const w of words) {
      if (POSITIVE.has(w)) score++;
      if (NEGATIVE.has(w)) score--;
    }
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }
}
