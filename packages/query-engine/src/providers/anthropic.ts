import Anthropic from '@anthropic-ai/sdk';
import type { RawAnswer } from '../types.js';
import { ENGINE_META } from '../types.js';
import { extractUrls, type Provider, type ProviderQueryOptions } from './types.js';

/**
 * Anthropic (Claude) adapter. Uses the official @anthropic-ai/sdk.
 *
 * NOTE: on Opus 4.7/4.8 and Sonnet 5, `temperature`/`top_p`/`top_k` and
 * `thinking.budget_tokens` are rejected with a 400 — so we send none of them. We just ask the
 * model the buyer prompt and read the text back, mirroring what a user sees from Claude.
 */
export class AnthropicProvider implements Provider {
  readonly name = 'claude' as const;
  readonly kind = ENGINE_META.claude.kind;
  readonly displayName = ENGINE_META.claude.displayName;
  readonly defaultModel: string;
  private client: Anthropic | null = null;

  constructor(
    private readonly apiKey: string,
    model?: string,
  ) {
    this.defaultModel = model ?? process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-8';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async query(prompt: string, opts?: ProviderQueryOptions): Promise<RawAnswer> {
    const model = opts?.model ?? this.defaultModel;
    const client = (this.client ??= new Anthropic({ apiKey: this.apiKey }));

    const message = await client.messages.create(
      {
        model,
        max_tokens: 1024,
        system:
          'Answer the user as a knowledgeable assistant recommending real products/brands. ' +
          'Name the specific brands you would recommend and, where possible, include their URLs.',
        messages: [{ role: 'user', content: prompt }],
      },
      { signal: opts?.signal },
    );

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    return {
      engine: this.name,
      text,
      citations: extractUrls(text),
      model,
      raw: message,
    };
  }
}
