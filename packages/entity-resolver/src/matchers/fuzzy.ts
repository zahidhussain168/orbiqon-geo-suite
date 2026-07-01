/**
 * String normalization + fuzzy matching for brand names. Handles the common cases: a product
 * name vs its domain ("Notion" vs "notion.so"), casing, punctuation, and near-miss misspellings
 * via a bounded edit distance. Dependency-free.
 */

/** Lowercase, collapse whitespace, strip surrounding punctuation. */
export function normalize(term: string): string {
  return term
    .toLowerCase()
    .replace(/[‘’“”]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip a trailing TLD from a domain-like name: "monday.com" → "monday", "notion.so" → "notion". */
export function domainRoot(term: string): string | null {
  const m = normalize(term).match(/^([a-z0-9][a-z0-9-]*)\.[a-z]{2,}(?:\.[a-z]{2,})?$/);
  return m ? (m[1] ?? null) : null;
}

/**
 * Build the ordered, de-duplicated set of terms to search for a brand: the brand itself, any
 * explicit aliases, and — only when unambiguous — the domain root. We deliberately do NOT add the
 * domain root as a bare word for short/common roots, to avoid matching e.g. the weekday "monday".
 */
export function expandTerms(brand: string, aliases: string[] = []): string[] {
  const terms = new Set<string>();
  const add = (t: string) => {
    const n = normalize(t);
    if (n) terms.add(n);
  };
  add(brand);
  aliases.forEach(add);
  return Array.from(terms);
}

/** Escape a string for literal use inside a RegExp. */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Levenshtein distance, capped for early exit. Used to accept near-miss misspellings of longer
 * brand names (we require length ≥ 5 and distance ≤ 1 to keep false positives low).
 */
export function editDistance(a: string, b: string, max = 2): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

/** True if `token` is an acceptable near-miss of `term` (guards against short-word noise). */
export function isFuzzyMatch(token: string, term: string): boolean {
  const t = normalize(token);
  const q = normalize(term);
  if (t === q) return true;
  if (q.length < 5) return false; // too short to fuzzy-match safely
  return editDistance(t, q, 1) <= 1;
}
