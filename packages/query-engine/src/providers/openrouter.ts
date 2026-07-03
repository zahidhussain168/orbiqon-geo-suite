import OpenAI from 'openai';
import type { EngineName, RawAnswer } from '../types.js';
import { ENGINE_META } from '../types.js';
import { extractUrls, type Provider, type ProviderQueryOptions } from './types.js';

const SYSTEM =
  'Answer as a knowledgeable assistant recommending real products/brands. Name the ' +
  'specific brands you would recommend and, where possible, include their URLs.';

/** Engines that can route through OpenRouter (the four live API surfaces). */
export type OpenRouterEngine = 'chatgpt' | 'claude' | 'gemini' | 'perplexity';

/** Default OpenRouter model slugs per engine surface. All overridable via env. */
export const OPENROUTER_DEFAULT_MODELS: Record<OpenRouterEngine, string> = {
  chatgpt: 'openai/gpt-4o',
  claude: 'anthropic/claude-sonnet-4.5',
  gemini: 'google/gemini-2.5-flash',
  perplexity: 'perplexity/sonar',
};

/**
 * Routes one engine surface through OpenRouter's OpenAI-compatible gateway. One API key and one
 * balance serve every model, which is the simplest way to run all four engines live. Using the
 * gateway also sidesteps provider-native parameter quirks (for example Anthropic rejecting
 * temperature on some models), since OpenRouter normalizes the request.
 */
export class OpenRouterProvider implements Provider {
  readonly kind = 'api' as const;
  readonly displayName: string;
  readonly defaultModel: string;
  private client: OpenAI | null = null;

  constructor(
    readonly name: EngineName,
    private readonly apiKey: string,
    model: string,
  ) {
    this.displayName = ENGINE_META[name].displayName;
    this.defaultModel = model;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async query(prompt: string, opts?: ProviderQueryOptions): Promise<RawAnswer> {
    const model = opts?.model ?? this.defaultModel;
    const client = (this.client ??= new OpenAI({
      apiKey: this.apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        // Optional but recommended by OpenRouter for attribution.
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://geostudio.ai',
        'X-Title': 'GEO Studio AmICited',
      },
    }));

    const completion = await client.chat.completions.create(
      {
        model,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1024,
      },
      { signal: opts?.signal },
    );

    const text = (completion.choices[0]?.message?.content ?? '').trim();
    // Search-grounded models (Perplexity) may surface a top-level citations array.
    const raw = completion as unknown as { citations?: unknown };
    const apiCitations = Array.isArray(raw.citations)
      ? raw.citations.filter((c): c is string => typeof c === 'string')
      : [];
    const citations = Array.from(new Set([...apiCitations, ...extractUrls(text)]));

    return { engine: this.name, text, citations, model, raw: completion };
  }
}

/** Resolve the model slug for an engine, honoring per-engine env overrides. */
export function openRouterModel(engine: OpenRouterEngine, env: NodeJS.ProcessEnv): string {
  const override = {
    chatgpt: env.OPENROUTER_CHATGPT_MODEL,
    claude: env.OPENROUTER_CLAUDE_MODEL,
    gemini: env.OPENROUTER_GEMINI_MODEL,
    perplexity: env.OPENROUTER_PERPLEXITY_MODEL,
  }[engine];
  return override ?? OPENROUTER_DEFAULT_MODELS[engine];
}
