import OpenAI from 'openai';
import type { EngineName, RawAnswer } from '../types.js';
import { ENGINE_META } from '../types.js';
import { extractUrls, type Provider, type ProviderQueryOptions } from './types.js';

/** Engines that can route through OpenRouter (the four live API surfaces). */
export type OpenRouterEngine = 'chatgpt' | 'claude' | 'gemini' | 'perplexity';

/** Default OpenRouter model slugs per engine surface. All overridable via env. */
export const OPENROUTER_DEFAULT_MODELS: Record<OpenRouterEngine, string> = {
  chatgpt: 'openai/gpt-4o',
  claude: 'anthropic/claude-sonnet-4.5',
  gemini: 'google/gemini-2.5-flash',
  perplexity: 'perplexity/sonar',
};

// Temperature so repeated samples genuinely vary (that is what makes the rate real).
const SAMPLE_TEMPERATURE = 0.9;

/**
 * Routes one engine surface through OpenRouter's OpenAI-compatible gateway. One API key and one
 * balance serve every model. We send the buyer question the way a real user would (no steering
 * system prompt), so the answer reflects what a person actually sees. Using the gateway also
 * sidesteps provider-native parameter quirks since OpenRouter normalizes the request.
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
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://geostudio.ai',
        'X-Title': 'GEO Studio AmICited',
      },
    }));

    const completion = await client.chat.completions.create(
      {
        model,
        // No system prompt: ask exactly what a real buyer would type.
        messages: [{ role: 'user', content: prompt }],
        temperature: SAMPLE_TEMPERATURE,
        max_tokens: 1024,
      },
      { signal: opts?.signal },
    );

    const text = (completion.choices[0]?.message?.content ?? '').trim();
    // Search-grounded models (Perplexity, and any :online model) surface a citations array.
    const raw = completion as unknown as { citations?: unknown };
    const apiCitations = Array.isArray(raw.citations)
      ? raw.citations.filter((c): c is string => typeof c === 'string')
      : [];
    const citations = Array.from(new Set([...apiCitations, ...extractUrls(text)]));

    return { engine: this.name, text, citations, model, raw: completion };
  }
}

/**
 * Resolve the model slug for an engine, honoring per-engine env overrides and enabling
 * OpenRouter web search (":online") by default so answers reflect the current web. Perplexity
 * already searches, so it is left as-is.
 */
export function openRouterModel(engine: OpenRouterEngine, env: NodeJS.ProcessEnv): string {
  const override = {
    chatgpt: env.OPENROUTER_CHATGPT_MODEL,
    claude: env.OPENROUTER_CLAUDE_MODEL,
    gemini: env.OPENROUTER_GEMINI_MODEL,
    perplexity: env.OPENROUTER_PERPLEXITY_MODEL,
  }[engine];
  const base = override ?? OPENROUTER_DEFAULT_MODELS[engine];

  const webSearch = env.OPENROUTER_WEB_SEARCH !== 'false'; // default on
  if (webSearch && engine !== 'perplexity' && !base.includes(':online')) {
    return `${base}:online`;
  }
  return base;
}
