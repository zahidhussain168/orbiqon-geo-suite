import OpenAI from 'openai';
import { suggestPrompts } from './prompts';

/**
 * Generate a realistic, diverse grid of buyer prompts for a brand's category using a cheap model,
 * so a scan reflects how people actually ask AI assistants (not just "best X for Y"). Server-only
 * (needs the API key). Always safe: falls back to the static templates on any failure or in mock
 * mode, so the app never breaks.
 */
export interface PromptGenInput {
  brand: string;
  website?: string;
  category?: string;
  count?: number;
}

const GEN_MODEL = process.env.OPENROUTER_PROMPTGEN_MODEL ?? 'openai/gpt-4o-mini';

export async function generatePrompts(input: PromptGenInput): Promise<string[]> {
  const count = Math.min(Math.max(input.count ?? 6, 3), 8);
  const key = process.env.OPENROUTER_API_KEY;
  const fallback = () => suggestPrompts(input.category, input.brand, count);

  if (!key || process.env.MOCK_LLM === 'true') return fallback();

  try {
    const client = new OpenAI({
      apiKey: key,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://geostudio.ai',
        'X-Title': 'GEO Studio AmICited',
      },
    });

    const system =
      'You write the exact search prompts real buyers type into AI assistants like ChatGPT when ' +
      'they are choosing a product or tool. Output only a JSON array of short prompt strings.';
    const user =
      `Brand: ${input.brand}\n` +
      `Website: ${input.website ?? 'unknown'}\n` +
      `Category: ${input.category || 'infer it from the brand'}\n\n` +
      `Write ${count} distinct prompts a potential buyer would ask an AI assistant while ` +
      `researching this category, WITHOUT naming ${input.brand}. Cover a mix of intents: a ` +
      `"best X for [use case]" question, a comparison or "X vs Y", an "alternatives to ` +
      `[a well known competitor]", a problem-first question ("how do I ..."), a budget or ` +
      `pricing angle, and an industry or team-size angle. Keep each under 12 words, natural, ` +
      `like a real search. Return ONLY a JSON array of strings.`;

    const completion = await client.chat.completions.create({
      model: GEN_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const text = completion.choices[0]?.message?.content ?? '';
    const prompts = parsePromptList(text);
    return prompts.length >= 3 ? prompts.slice(0, count) : fallback();
  } catch {
    return fallback();
  }
}

/** Lenient parse: accept a JSON array anywhere in the text, else fall back to line splitting. */
function parsePromptList(text: string): string[] {
  const clean = (arr: unknown[]): string[] =>
    Array.from(
      new Set(
        arr
          .filter((s): s is string => typeof s === 'string')
          .map((s) => s.trim().replace(/^["'\-\d.\s]+/, '').trim())
          .filter((s) => s.length >= 6 && s.length <= 120),
      ),
    );

  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return clean(parsed);
    } catch {
      /* fall through */
    }
  }
  return clean(
    text
      .split('\n')
      .map((l) => l.replace(/^["'\-*\d.\s]+/, '').trim())
      .filter(Boolean),
  );
}
