import OpenAI from 'openai';
import type { RawAnswer } from '../types.js';
import { ENGINE_META } from '../types.js';
import { extractUrls, type Provider, type ProviderQueryOptions } from './types.js';

/**
 * Perplexity adapter. Perplexity's Sonar models expose an OpenAI-compatible Chat Completions
 * endpoint, so we reuse the `openai` SDK pointed at their base URL. Perplexity is search-grounded
 * and returns a top-level `citations` array (not in the OpenAI type), which we surface directly.
 */
export class PerplexityProvider implements Provider {
  readonly name = 'perplexity' as const;
  readonly kind = ENGINE_META.perplexity.kind;
  readonly displayName = ENGINE_META.perplexity.displayName;
  readonly defaultModel: string;
  private client: OpenAI | null = null;

  constructor(
    private readonly apiKey: string,
    model?: string,
  ) {
    this.defaultModel = model ?? process.env.PERPLEXITY_MODEL ?? 'sonar';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async query(prompt: string, opts?: ProviderQueryOptions): Promise<RawAnswer> {
    const model = opts?.model ?? this.defaultModel;
    const client = (this.client ??= new OpenAI({
      apiKey: this.apiKey,
      baseURL: 'https://api.perplexity.ai',
    }));

    const completion = await client.chat.completions.create(
      {
        model,
        messages: [
          {
            role: 'system',
            content:
              'Answer as a knowledgeable assistant recommending real products/brands. Name the ' +
              'specific brands you would recommend.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1024,
      },
      { signal: opts?.signal },
    );

    const text = (completion.choices[0]?.message?.content ?? '').trim();
    // Perplexity returns a top-level `citations: string[]` outside the OpenAI schema.
    const raw = completion as unknown as { citations?: unknown };
    const apiCitations = Array.isArray(raw.citations)
      ? raw.citations.filter((c): c is string => typeof c === 'string')
      : [];
    const citations = Array.from(new Set([...apiCitations, ...extractUrls(text)]));

    return {
      engine: this.name,
      text,
      citations,
      model,
      raw: completion,
    };
  }
}
