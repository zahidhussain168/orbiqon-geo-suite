import type { RawAnswer } from '../types.js';
import { ENGINE_META, NotImplementedError } from '../types.js';
import type { Provider, ProviderQueryOptions } from './types.js';

/**
 * Stub for the ChatGPT web UI surface (distinct from the OpenAI API `chatgpt` provider).
 * The logged-in web experience needs a headless-browser scraper — deferred to a later pass.
 */
export class ChatGptWebProvider implements Provider {
  readonly name = 'chatgpt-web' as const;
  readonly kind = ENGINE_META['chatgpt-web'].kind;
  readonly displayName = ENGINE_META['chatgpt-web'].displayName;
  readonly defaultModel = 'chatgpt-web';

  isConfigured(): boolean {
    return false;
  }

  async query(_prompt: string, _opts?: ProviderQueryOptions): Promise<RawAnswer> {
    throw new NotImplementedError(this.name);
  }
}
