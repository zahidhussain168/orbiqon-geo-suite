/**
 * The six-tool suite. Single source of truth for nav, cards, tool pages, pricing, sitemap,
 * and the waitlist. Adding or promoting a tool is a one-entry change here.
 *
 * Copy rule: no em dashes in any string.
 */
export type ToolLayer = 'DIAGNOSE' | 'FIX' | 'MANAGE';
export type ToolStatus = 'live' | 'soon';

export interface Tool {
  slug: string;
  name: string;
  layer: ToolLayer;
  status: ToolStatus;
  /** Where the card/nav links. Live tools may point at their app route. */
  href: string;
  /** One confident sentence. */
  oneLiner: string;
  /** Three capability bullets shown on cards and tool pages. */
  capabilities: [string, string, string];
  /** Planned price label for coming-soon tools. */
  plannedPrice?: string;
}

export const LAYERS: { id: ToolLayer; label: string; blurb: string }[] = [
  {
    id: 'DIAGNOSE',
    label: 'Diagnose',
    blurb: 'Free tools that show where AI ignores you. No signup.',
  },
  {
    id: 'FIX',
    label: 'Fix',
    blurb: 'We generate the content and structure that earns citations. Not just a report.',
  },
  {
    id: 'MANAGE',
    label: 'Manage',
    blurb: 'One white-label platform for agencies to run it all across every client.',
  },
];

export const TOOLS: Tool[] = [
  {
    slug: 'amicited',
    name: 'AmICited',
    layer: 'DIAGNOSE',
    status: 'live',
    href: '/check',
    oneLiner:
      'Are you cited by ChatGPT, Claude, Perplexity and Gemini? A free multi-engine visibility check.',
    capabilities: [
      'Multi-engine visibility score from real sampled runs',
      'Competitor reveal: who gets named instead of you',
      'Honest sampled rates, never a fake yes or no',
    ],
  },
  {
    slug: 'prompt-gap-finder',
    name: 'Prompt Gap Finder',
    layer: 'DIAGNOSE',
    status: 'soon',
    href: '/tools/prompt-gap-finder',
    oneLiner: 'The prompts where competitors get cited and you do not, ranked by how winnable they are.',
    capabilities: [
      'Auto-generated grid of real buyer prompts for your category',
      'Ranked list of the gaps you can realistically win',
      'Share-of-voice comparison against named competitors',
    ],
  },
  {
    slug: 'crawler-audit',
    name: 'AI Crawler Audit + llms.txt',
    layer: 'DIAGNOSE',
    status: 'soon',
    href: '/tools/crawler-audit',
    oneLiner:
      'Check whether your site blocks AI crawlers, then generate a clean llms.txt access file.',
    capabilities: [
      'Detect blocks on GPTBot, ClaudeBot, PerplexityBot and Google-Extended',
      'Plain-English list of what is wrong and how to fix it',
      'One-click llms.txt generation you can paste and ship',
    ],
  },
  {
    slug: 'schemaforge',
    name: 'SchemaForge',
    layer: 'FIX',
    status: 'soon',
    href: '/tools/schemaforge',
    plannedPrice: '$29/mo planned',
    oneLiner:
      'Paste a URL and get AI-extractable JSON-LD plus answer-first TL;DR and FAQ blocks built for AI to quote.',
    capabilities: [
      'Auto-detects the right schema type for the page',
      'Answer-first blocks in the shape AI engines quote',
      'Consistency check flags schema that contradicts the page',
    ],
  },
  {
    slug: 'citation-content-builder',
    name: 'Citation Content Builder',
    layer: 'FIX',
    status: 'soon',
    href: '/tools/citation-content-builder',
    plannedPrice: '$49/mo planned',
    oneLiner:
      'Generates the FAQ, comparison and best-X-for-Y pages that actually earn AI citations, ready to publish.',
    capabilities: [
      'Page templates tuned to the formats AI engines quote',
      'Built on evidenced levers: answer-first, stats, sources',
      'Optional citation tracking on the pages you publish',
    ],
  },
  {
    slug: 'geo-studio',
    name: 'GEO-Studio',
    layer: 'MANAGE',
    status: 'soon',
    href: '/tools/geo-studio',
    plannedPrice: '$199 to $299/mo planned',
    oneLiner:
      'The white-label platform for agencies to run diagnose, fix and report across every client.',
    capabilities: [
      'Multi-client workspaces with scheduled tracking',
      'Share-of-voice dashboards and competitor benchmarking',
      'Built-in fix execution and branded client reports',
    ],
  },
];

export function toolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByLayer(layer: ToolLayer): Tool[] {
  return TOOLS.filter((t) => t.layer === layer);
}

export const LIVE_TOOLS = TOOLS.filter((t) => t.status === 'live');
export const SOON_TOOLS = TOOLS.filter((t) => t.status === 'soon');
