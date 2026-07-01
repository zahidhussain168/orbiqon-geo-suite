import type { EngineKind, EngineName, RawAnswer } from '../types.js';

export interface ProviderQueryOptions {
  model?: string;
  signal?: AbortSignal;
}

/**
 * A Provider knows how to query exactly one engine surface. It is brand-unaware: it takes a
 * prompt and returns a {@link RawAnswer}. Providers must be cheap to construct; the real
 * network client is created lazily inside {@link Provider.query}.
 */
export interface Provider {
  readonly name: EngineName;
  readonly displayName: string;
  readonly kind: EngineKind;
  /** True when real credentials are present (a live adapter), false for mock/unconfigured. */
  isConfigured(): boolean;
  /** The model id this provider will use by default. */
  readonly defaultModel: string;
  query(prompt: string, opts?: ProviderQueryOptions): Promise<RawAnswer>;
}

/** Best-effort URL extraction shared by adapters that don't return structured citations. */
export function extractUrls(text: string): string[] {
  const re = /\bhttps?:\/\/[^\s<>()"']+/gi;
  const found = text.match(re) ?? [];
  const cleaned = found.map((u) => u.replace(/[.,;:)\]}'"]+$/, ''));
  return Array.from(new Set(cleaned));
}
