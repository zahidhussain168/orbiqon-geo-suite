import type { RawAnswer } from '../types.js';
import { ENGINE_META, NotImplementedError } from '../types.js';
import type { Provider, ProviderQueryOptions } from './types.js';

/**
 * Stub for Google AI Overviews. This surface has no clean API, so it needs a headless-browser
 * scraper — deferred to a later pass. The interface is here so the engine treats it as a
 * first-class surface today (UI shows "coming soon") and the real scraper drops in later
 * without touching callers.
 */
export class GoogleAiOverviewsProvider implements Provider {
  readonly name = 'google-ai-overviews' as const;
  readonly kind = ENGINE_META['google-ai-overviews'].kind;
  readonly displayName = ENGINE_META['google-ai-overviews'].displayName;
  readonly defaultModel = 'ai-overviews';

  isConfigured(): boolean {
    return false;
  }

  async query(_prompt: string, _opts?: ProviderQueryOptions): Promise<RawAnswer> {
    throw new NotImplementedError(this.name);
  }
}
