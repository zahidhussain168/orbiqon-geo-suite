import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RawAnswer } from '../types.js';
import { ENGINE_META } from '../types.js';
import { extractUrls, type Provider, type ProviderQueryOptions } from './types.js';

/**
 * Google Gemini adapter via the official @google/generative-ai SDK.
 */
export class GeminiProvider implements Provider {
  readonly name = 'gemini' as const;
  readonly kind = ENGINE_META.gemini.kind;
  readonly displayName = ENGINE_META.gemini.displayName;
  readonly defaultModel: string;
  private client: GoogleGenerativeAI | null = null;

  constructor(
    private readonly apiKey: string,
    model?: string,
  ) {
    this.defaultModel = model ?? process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async query(prompt: string, opts?: ProviderQueryOptions): Promise<RawAnswer> {
    const model = opts?.model ?? this.defaultModel;
    const client = (this.client ??= new GoogleGenerativeAI(this.apiKey));
    const generative = client.getGenerativeModel({
      model,
      systemInstruction:
        'Answer as a knowledgeable assistant recommending real products/brands. Name the ' +
        'specific brands you would recommend and, where possible, include their URLs.',
    });

    const result = await generative.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024 },
    });

    const text = result.response.text().trim();

    return {
      engine: this.name,
      text,
      citations: extractUrls(text),
      model,
      raw: result.response,
    };
  }
}
