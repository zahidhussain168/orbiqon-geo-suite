/**
 * Canonicalizing brand names so the same entity is not counted (or ranked) more than once.
 * Two problems this solves, both seen in real AI answers:
 *   1. A product and its domain: "OneNote" and "onenote.com" are the same thing.
 *   2. A product and its qualified name: "Microsoft OneNote", "Google Workspace" belong with
 *      "OneNote" / "Google" when those appear standalone.
 * Without this, duplicates pad the ranked list and push the tracked brand to a false low position,
 * which then drags the score down.
 */
import { domainRoot, normalize } from './matchers/fuzzy.js';

/** Generic qualifier tokens that never distinguish one brand from another. */
const GENERIC_TOKENS = new Set([
  'inc',
  'llc',
  'app',
  'apps',
  'software',
  'platform',
  'suite',
  'workspace',
  'cloud',
  'online',
  'pro',
  'plus',
  'io',
]);

/** Base canonical key: a domain collapses to its root, otherwise the normalized name. */
export function canonicalKey(name: string): string {
  const n = normalize(name);
  return domainRoot(n) ?? n;
}

/**
 * Given the set of canonical keys present, return a map folding each multiword key into a
 * standalone single-word root when one exists (preferring the distinctive product token over a
 * company prefix). Single-word keys map to themselves.
 */
export function foldFamilies(keys: Iterable<string>): Map<string, string> {
  const present = new Set(keys);
  const singles = new Set([...present].filter((k) => !k.includes(' ') && k.length >= 4));
  const out = new Map<string, string>();
  for (const key of present) {
    if (!key.includes(' ')) {
      out.set(key, key);
      continue;
    }
    const toks = key.split(' ');
    const last = toks[toks.length - 1] ?? '';
    const first = toks[0] ?? '';
    // Prefer the last token (usually the product) then the first (usually the company),
    // but only fold into a token that actually stands alone and is not a generic qualifier.
    const root = [last, first].find(
      (t) => t !== key && singles.has(t) && !GENERIC_TOKENS.has(t),
    );
    out.set(key, root ?? key);
  }
  return out;
}
