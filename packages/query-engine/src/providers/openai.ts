import OpenAI from 'openai';
import type { RawAnswer } from '../types.js';
import { ENGINE_META } from '../types.js';
import { extractUrls, type Provider, type ProviderQueryOptions } from './types.js';

/**
 * OpenAI (ChatGPT) adapter via the official `openai` SDK, Chat Completions endpoint.
 * Approximates what a ChatGPT user sees; the real logged-in web UI is a separate stubbed surface.
 */
export class OpenAiProvider implements Provider {
  readonly name = 'chatgpt' as const;
  readonly kind = ENGINE_META.chatgpt.kind;
  readonly displayName = ENGINE_META.chatgpt.displayName;
  readonly defaultModel: string;
  private client: OpenAI | null = null;

  constructor(
    private readonly apiKey: string,
    model?: string,
  ) {
    this.defaultModel = model ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async query(prompt: string, opts?: ProviderQueryOptions): Promise<RawAnswer> {
    const model = opts?.model ?? this.defaultModel;
    const client = (this.client ??= new OpenAI({ apiKey: this.apiKey }));

    const completion = await client.chat.completions.create(
      {
        model,
        messages: [
          {
            role: 'system',
            content:
              'Answer as a knowledgeable assistant recommending real products/brands. Name the ' +
              'specific brands you would recommend and, where possible, include their URLs.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1024,
      },
      { signal: opts?.signal },
    );

    const text = (completion.choices[0]?.message?.content ?? '').trim();

    return {
      engine: this.name,
      text,
      citations: extractUrls(text),
      model,
      raw: completion,
    };
  }
}
