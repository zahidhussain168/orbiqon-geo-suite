import type { EngineName } from '@orbiqon/query-engine';

/** Brand-ish accent per engine surface (client-only display metadata). */
export const ENGINE_ACCENT: Record<EngineName, string> = {
  chatgpt: '#10a37f',
  claude: '#d97757',
  perplexity: '#0891b2', // cyan-600 — readable on light surfaces
  gemini: '#6366f1',
  'google-ai-overviews': '#64748b',
  'chatgpt-web': '#64748b',
};

export function engineAccent(name: EngineName): string {
  return ENGINE_ACCENT[name] ?? '#94a3b8';
}

/** Quick-fill examples so a first-time visitor can see it work in one click. */
export interface Preset {
  brand: string;
  website: string;
  category: string;
  prompts: string[];
}

export const PRESETS: Preset[] = [
  {
    brand: 'Linear',
    website: 'linear.app',
    category: 'issue tracking',
    prompts: [
      'best issue tracker for engineering teams',
      'Jira alternatives for startups',
      'best project management tool for software teams',
    ],
  },
  {
    brand: 'Ramp',
    website: 'ramp.com',
    category: 'corporate cards',
    prompts: ['best corporate card for startups', 'Brex alternatives', 'best expense management software'],
  },
  {
    brand: 'Notion',
    website: 'notion.so',
    category: 'team knowledge base',
    prompts: ['best note-taking app for teams', 'best team wiki software', 'Confluence alternatives'],
  },
];
