import type { EngineName, EngineKind } from '@orbiqon/query-engine';

/** Per (engine × prompt) outcome — powers the "By prompt" matrix. */
export interface PromptCell {
  prompt: string;
  cited: boolean;
  bestPosition: number | null;
}

/** A representative sample answer for the expandable "sample answers" view. */
export interface AnswerExample {
  prompt: string;
  text: string;
  cited: boolean;
}

/** Per-engine summary aggregated across all of a scan's prompts. */
export interface EngineSummary {
  engine: EngineName;
  displayName: string;
  status: 'ok' | 'not_implemented' | 'error';
  configured: boolean;
  kind: EngineKind;
  citedCount: number;
  sampleCount: number;
  citationRate: number;
  bestPosition: number | null;
  avgPosition: number | null;
  competitors: string[];
  citations: string[];
  /** One entry per prompt (matrix rows). */
  perPrompt: PromptCell[];
  /** A couple of representative answer snippets, cited-first. */
  examples: AnswerExample[];
}

export interface CompetitorTally {
  name: string;
  count: number;
}

/** The full result of a scan — the shape the UI renders and (optionally) what we persist/reload. */
export interface ScanResult {
  id: string | null; // db id, or null when persistence is off
  brand: string;
  website?: string;
  category?: string;
  prompts: string[];
  score: number; // 0–100 visibility score
  engines: EngineSummary[];
  competitors: CompetitorTally[];
  meta: {
    samples: number;
    liveCalls: number;
    cachedCalls: number;
    cappedCalls: number;
    mock: boolean;
    droppedPrompts: number;
  };
  createdAt: string;
}

export interface ScanRequest {
  brand: string;
  website?: string;
  category?: string;
  prompts?: string[];
}
