/**
 * Best-effort extraction of the brand names and URLs an AI answer mentions. Heuristic, but it
 * canonicalizes so the same entity is not double-counted (a product and its domain, or its
 * qualified name), which keeps order-of-appearance ranking honest. When the caller supplies a
 * `known` brand list, we anchor on those for precision and never filter them out.
 */
import { normalize } from './matchers/fuzzy.js';
import { canonicalKey, foldFamilies } from './canonical.js';

export interface ExtractedBrand {
  name: string;
  index: number;
}

// Words that look capitalized in prose but are not brands. Kept high-precision.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'i', 'it', 'you', 'your', 'our', 'we', 'they', 'for', 'and', 'or', 'but', 'if',
  'best', 'top', 'popular', 'choice', 'options', 'option', 'tool', 'tools', 'app', 'apps',
  'here', 'this', 'that', 'these', 'those', 'some', 'many', 'most', 'both', 'either', 'depends',
  'overall', 'however', 'note', 'overview', 'summary', 'conclusion', 'introduction', 'choosing',
  'consider', 'pros', 'cons', 'pricing', 'features', 'feature', 'key', 'why', 'when', 'what',
  'which', 'how', 'use', 'using', 'free', 'paid', 'plan', 'plans', 'task', 'tasks', 'team', 'teams',
  'platform', 'platforms', 'software', 'solution', 'solutions', 'service', 'services', 'system',
  'systems', 'users', 'user', 'business', 'startup', 'startups', 'enterprise', 'small', 'large',
  'example', 'following', 'includes', 'include', 'including', 'great', 'good', 'ideal', 'perfect',
  // Descriptors that appear capitalized in bullets ("Excellent:", "Powerful features").
  'excellent', 'powerful', 'simple', 'simplicity', 'quick', 'easy', 'robust', 'comprehensive',
  'flexible', 'intuitive', 'seamless', 'affordable', 'versatile', 'reliable', 'scalable', 'secure',
  'modern', 'clean', 'minimal', 'advanced', 'basic', 'essential', 'unique', 'effective', 'efficient',
  'smart', 'fast', 'strong', 'rich', 'collaborative', 'customizable', 'lightweight', 'premium',
  'free', 'cost', 'price', 'value', 'support', 'integration', 'integrations', 'note', 'notes',
  'wiki', 'docs', 'document', 'documents', 'productivity', 'collaboration', 'management',
  'real', 'realtime', 'based', 'structured', 'markdown', 'cloud', 'web', 'mobile', 'desktop',
  'open', 'source', 'opensource', 'api', 'crm', 'saas', 'offline', 'automation', 'templates',
  'template', 'dashboard', 'dashboards', 'workflow', 'workflows', 'unlimited', 'customization',
  'works', 'work', 'website', 'site', 'sites', 'page', 'pages', 'view', 'views', 'block', 'blocks',
  // Weekdays / months (sentence starters).
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',
  'november', 'december',
  // IANA-reserved placeholder domains (also filters mock output).
  'example.com', 'example.org', 'example.net',
]);

const DOMAIN_RE = /\b([a-z0-9][a-z0-9-]*\.(?:com|io|so|ai|co|org|net|app|dev|xyz|inc))\b/gi;
// Capitalized entity: leading capital, optional internal caps/digits, optional TLD, optional
// space/hyphen-joined capitalized words (e.g. "Google Sheets", "Monday.com", "ClickUp").
const ENTITY_RE = /\b([A-Z][A-Za-z0-9]*(?:\.[a-z]{2,})?(?:[ -][A-Z][A-Za-z0-9]+)*)\b/g;

export function extractBrands(text: string, known: string[] = []): ExtractedBrand[] {
  const knownNorm = new Set(known.map(normalize).filter(Boolean));
  // canonical key -> best occurrence
  const found = new Map<string, ExtractedBrand>();

  const consider = (raw: string, index: number) => {
    const name = raw.trim();
    const norm = normalize(name);
    if (!norm) return;
    const isKnown = knownNorm.has(norm) || knownNorm.has(canonicalKey(name));
    if (!isKnown && STOPWORDS.has(norm)) return;

    // A single short common-looking word with no distinguishing signal is probably prose.
    const hasSignal =
      isKnown ||
      /[.]/.test(name) || // domain
      /[a-z][A-Z]/.test(name) || // camelCase
      /\d/.test(name) || // has a digit
      name.includes(' ') || // multi-word
      norm.length >= 4; // reasonably long single token
    if (!hasSignal) return;

    const key = canonicalKey(name);
    const existing = found.get(key);
    if (!existing) {
      found.set(key, { name, index });
      return;
    }
    // Keep the earliest appearance; prefer a clean proper-name display over a bare domain.
    if (index < existing.index) existing.index = index;
    if (preferDisplay(name, existing.name)) existing.name = name;
  };

  for (const m of text.matchAll(ENTITY_RE)) {
    if (m.index != null) consider(m[1] ?? '', m.index);
  }
  for (const m of text.matchAll(DOMAIN_RE)) {
    if (m.index != null) consider(m[1] ?? '', m.index);
  }
  for (const k of known) {
    const idx = text.toLowerCase().indexOf(normalize(k));
    if (idx >= 0) consider(text.slice(idx, idx + k.length), idx);
  }

  // Fold qualified names into their standalone root ("Microsoft OneNote" -> "OneNote").
  const fold = foldFamilies(found.keys());
  const merged = new Map<string, ExtractedBrand>();
  for (const [key, entry] of found) {
    const canon = fold.get(key) ?? key;
    const target = merged.get(canon);
    if (!target) {
      merged.set(canon, { ...entry });
    } else {
      if (entry.index < target.index) target.index = entry.index;
      if (preferDisplay(entry.name, target.name)) target.name = entry.name;
    }
  }

  return Array.from(merged.values()).sort((a, b) => a.index - b.index);
}

/** Prefer a proper, capitalized, non-domain display over a bare domain or longer qualified name. */
function preferDisplay(candidate: string, current: string): boolean {
  const cDomain = /\.[a-z]{2,}$/i.test(candidate);
  const curDomain = /\.[a-z]{2,}$/i.test(current);
  if (curDomain && !cDomain) return true; // proper name beats a domain
  if (cDomain && !curDomain) return false;
  // Otherwise prefer the shorter (usually the canonical product name).
  return candidate.length < current.length;
}

/** Extract URLs (same rules as the query-engine's util, duplicated to keep packages independent). */
export function extractUrls(text: string): string[] {
  const re = /\bhttps?:\/\/[^\s<>()"']+/gi;
  const found = text.match(re) ?? [];
  return Array.from(new Set(found.map((u) => u.replace(/[.,;:)\]}'"]+$/, ''))));
}
