import type { EngineName } from '../types.js';
import { AnthropicProvider } from './anthropic.js';
import { ChatGptWebProvider } from './chatgpt-web.js';
import { GeminiProvider } from './gemini.js';
import { GoogleAiOverviewsProvider } from './google-ai-overviews.js';
import { MockProvider, type MockConfig } from './mock.js';
import { OpenAiProvider } from './openai.js';
import { PerplexityProvider } from './perplexity.js';
import { OpenRouterProvider, openRouterModel, type OpenRouterEngine } from './openrouter.js';
import type { Provider } from './types.js';

export * from './types.js';
export { AnthropicProvider } from './anthropic.js';
export { OpenAiProvider } from './openai.js';
export { GeminiProvider } from './gemini.js';
export { PerplexityProvider } from './perplexity.js';
export { GoogleAiOverviewsProvider } from './google-ai-overviews.js';
export { ChatGptWebProvider } from './chatgpt-web.js';
export { MockProvider, type MockConfig } from './mock.js';
export {
  OpenRouterProvider,
  openRouterModel,
  OPENROUTER_DEFAULT_MODELS,
  type OpenRouterEngine,
} from './openrouter.js';

/** The four API engines we implement live, plus the two stubbed scrape surfaces. */
export const DEFAULT_ENGINES: EngineName[] = [
  'chatgpt',
  'claude',
  'gemini',
  'perplexity',
  'google-ai-overviews',
  'chatgpt-web',
];

export interface CreateProvidersOptions {
  /** Which engines to include, in display order. Defaults to all six. */
  engines?: EngineName[];
  /** Force every API engine to use the deterministic mock (offline mode). */
  forceMock?: boolean;
  /** Config passed to any mock providers (so demo answers can name the tracked brand). */
  mock?: MockConfig;
  /** Environment source for API keys / models. Defaults to process.env. */
  env?: NodeJS.ProcessEnv;
}

/**
 * Build the provider list from config + environment. For each API engine: use the real adapter
 * when a key is present and mock mode is off; otherwise fall back to the deterministic mock so the
 * whole pipeline runs offline. The two scrape surfaces are always their stubs in this pass.
 */
export function createProviders(options: CreateProvidersOptions = {}): Provider[] {
  const env = options.env ?? process.env;
  const engines = options.engines ?? DEFAULT_ENGINES;
  const forceMock = options.forceMock ?? env.MOCK_LLM === 'true';
  const mockConfig = options.mock ?? {};
  const orKey = env.OPENROUTER_API_KEY;

  // When an OpenRouter key is set, route the live engines through it (one key, one balance).
  const viaOpenRouter = (engine: OpenRouterEngine): Provider | null =>
    !forceMock && orKey ? new OpenRouterProvider(engine, orKey, openRouterModel(engine, env)) : null;

  const build = (engine: EngineName): Provider => {
    switch (engine) {
      case 'chatgpt': {
        const key = env.OPENAI_API_KEY;
        return (
          viaOpenRouter('chatgpt') ??
          (forceMock || !key
            ? new MockProvider('chatgpt', mockConfig)
            : new OpenAiProvider(key, env.OPENAI_MODEL))
        );
      }
      case 'claude': {
        const key = env.ANTHROPIC_API_KEY;
        return (
          viaOpenRouter('claude') ??
          (forceMock || !key
            ? new MockProvider('claude', mockConfig)
            : new AnthropicProvider(key, env.ANTHROPIC_MODEL))
        );
      }
      case 'gemini': {
        const key = env.GEMINI_API_KEY;
        return (
          viaOpenRouter('gemini') ??
          (forceMock || !key
            ? new MockProvider('gemini', mockConfig)
            : new GeminiProvider(key, env.GEMINI_MODEL))
        );
      }
      case 'perplexity': {
        const key = env.PERPLEXITY_API_KEY;
        return (
          viaOpenRouter('perplexity') ??
          (forceMock || !key
            ? new MockProvider('perplexity', mockConfig)
            : new PerplexityProvider(key, env.PERPLEXITY_MODEL))
        );
      }
      case 'google-ai-overviews':
        return new GoogleAiOverviewsProvider();
      case 'chatgpt-web':
        return new ChatGptWebProvider();
      default: {
        const exhaustive: never = engine;
        throw new Error(`Unknown engine: ${String(exhaustive)}`);
      }
    }
  };

  return engines.map(build);
}
