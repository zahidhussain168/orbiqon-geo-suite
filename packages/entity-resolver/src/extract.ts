/**
 * Best-effort extraction of the brand names and URLs an AI answer mentions. This is heuristic —
 * good enough to surface "who got named instead of you" and to rank order-of-appearance. When the
 * caller supplies a `known` brand list, we anchor on those for precision.
 */
import { normalize } from './matchers/fuzzy.js';

export interface ExtractedBrand {
  name: string;
  index: number;
}

// Words that look capitalized in prose but aren't brands. Kept small and high-precision.
const STOPWORDS = new Set(
  [
    'the',
    'a',
    'an',
    'i',
    'it',
    'you',
    'your',
    'our',
    'we',
    'they',
    'for',
    'and',
    'or',
    'but',
    'if',
    'best',
    'top',
    'popular',
    'choice',
    'options',
    'option',
    'tool',
    'tools',
    'app',
    'apps',
    'here',
    'this',
    'that',
    'these',
    'those',
    'some',
    'many',
    'most',
    'both',
    'either',
    'depends',
    'overall',
    'however',
    'note',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
    // IANA-reserved placeholder domains — never real brands (also filters mock output).
    'example.com',
    'example.org',
    'example.net',
    'example',
  ].map((w) => w),
);

const DOMAIN_RE = /\b([a-z0-9][a-z0-9-]*\.(?:com|io|so|ai|co|org|net|app|dev|xyz|inc))\b/gi;
// Capitalized entity: leading capital, optional internal caps/digits, optional TLD, optional
// space/hyphen-joined capitalized words (e.g. "Google Sheets", "Monday.com", "ClickUp").
const ENTITY_RE = /\b([A-Z][A-Za-z0-9]*(?:\.[a-z]{2,})?(?:[ -][A-Z][A-Za-z0-9]+)*)\b/g;

export function extractBrands(text: string, known: string[] = []): ExtractedBrand[] {
  const found = new Map<string, ExtractedBrand>(); // normalized → earliest occurrence

  const consider = (raw: string, index: number) => {
    const name = raw.trim();
    const norm = normalize(name);
    if (!norm) return;
    if (STOPWORDS.has(norm)) return;
    // Single short common-looking word with no distinguishing signal → skip, unless known.
    const isKnown = known.some((k) => normalize(k) === norm);
    const hasSignal =
      isKnown ||
      /[.]/.test(name) || // domain
      /[a-z][A-Z]/.test(name) || // camelCase
      /\d/.test(name) || // has digit
      name.includes(' ') || // multi-word
      norm.length >= 4; // reasonably long single token
    if (!hasSignal) return;
    const existing = found.get(norm);
    if (!existing || index < existing.index) {
      found.set(norm, { name, index });
    }
  };

  for (const m of text.matchAll(ENTITY_RE)) {
    if (m.index != null) consider(m[1] ?? '', m.index);
  }
  for (const m of text.matchAll(DOMAIN_RE)) {
    if (m.index != null) consider(m[1] ?? '', m.index);
  }
  // Anchor on explicitly-known brands too (catches lowercased mentions).
  for (const k of known) {
    const idx = text.toLowerCase().indexOf(normalize(k));
    if (idx >= 0) consider(text.slice(idx, idx + k.length), idx);
  }

  return Array.from(found.values()).sort((a, b) => a.index - b.index);
}

/** Extract URLs (same rules as the query-engine's util, duplicated to keep packages independent). */
export function extractUrls(text: string): string[] {
  const re = /\bhttps?:\/\/[^\s<>()"']+/gi;
  const found = text.match(re) ?? [];
  return Array.from(new Set(found.map((u) => u.replace(/[.,;:)\]}'"]+$/, ''))));
}
