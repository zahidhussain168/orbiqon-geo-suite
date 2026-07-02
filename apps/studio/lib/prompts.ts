/**
 * Auto-suggest buyer prompts so a non-expert doesn't have to know what to type. Given a category
 * (and optionally the brand), produce realistic "best X for Y" / "alternatives" style prompts ,
 * the kind of thing a buyer actually asks an AI.
 */

const CATEGORY_TEMPLATES: Record<string, string[]> = {
  'project management': [
    'best project management tool for startups',
    'best project management software for remote teams',
    'top Asana alternatives',
    'best tools to manage tasks and deadlines',
  ],
  crm: [
    'best CRM for small business',
    'best CRM for startups',
    'top Salesforce alternatives for SMBs',
    'best sales CRM with email automation',
  ],
  'email marketing': [
    'best email marketing platform for small business',
    'best Mailchimp alternatives',
    'top email tools for newsletters',
  ],
  analytics: [
    'best product analytics tools',
    'best Google Analytics alternatives',
    'top web analytics platforms for privacy',
  ],
};

/**
 * Return up to `max` suggested prompts. Uses category templates when available, otherwise builds
 * generic buyer prompts from the category/brand.
 */
export function suggestPrompts(category?: string, brand?: string, max = 5): string[] {
  const key = (category ?? '').trim().toLowerCase();
  const templated = CATEGORY_TEMPLATES[key];
  if (templated?.length) return templated.slice(0, max);

  const noun = category?.trim() || 'tools';
  const generic = [
    `best ${noun} for small business`,
    `best ${noun} for startups`,
    `top ${noun} in 2026`,
    brand ? `${brand} alternatives` : `best ${noun} alternatives`,
    `most popular ${noun}`,
  ];
  return generic.slice(0, max);
}

/** Known category keys, for a UI dropdown. */
export const KNOWN_CATEGORIES = Object.keys(CATEGORY_TEMPLATES);
