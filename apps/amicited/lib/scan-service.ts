import { getPrisma } from '@orbiqon/db';
import { EntityResolver } from '@orbiqon/entity-resolver';
import {
  clampScanInputs,
  CostGuard,
  createProviders,
  ENGINE_META,
  limitsFromEnv,
  QueryEngine,
  samplesFromEnv,
  type EngineName,
  type MentionDetector,
  type RunResult,
} from '@orbiqon/query-engine';
import { computeVisibilityScore } from './scoring';
import { suggestPrompts } from './prompts';
import type { CompetitorTally, EngineSummary, ScanRequest, ScanResult } from './types';

const MAX_COMPETITORS = 12;

/**
 * Run a full AmICited scan: query the engines across the (clamped) prompts, resolve mentions for
 * the brand, score visibility, and persist when a database is configured. Returns a ScanResult
 * that renders even when persistence is off (id === null).
 */
export async function runScan(request: ScanRequest): Promise<ScanResult> {
  const brand = request.brand.trim();
  const website = request.website?.trim() || undefined;
  const category = request.category?.trim() || undefined;

  const rawPrompts =
    request.prompts && request.prompts.length > 0
      ? request.prompts
      : suggestPrompts(category, brand);

  const limits = limitsFromEnv();
  const clamped = clampScanInputs(rawPrompts, samplesFromEnv(), limits);
  const aliases = deriveAliases(brand, website);

  const providers = createProviders({ mock: { brand, seed: brand } });
  const costGuard = new CostGuard(clamped.maxCalls);
  const engine = new QueryEngine({ providers, samples: clamped.samples, costGuard });
  const resolver = new EntityResolver();

  const detect: MentionDetector = (answer) =>
    resolver.resolve(answer.text, brand, { aliases, citations: answer.citations });

  const runs = await engine.runMany(clamped.prompts, { detectMention: detect });

  const engines = aggregateEngines(runs);
  const competitors = tallyCompetitors(runs);
  const score = computeVisibilityScore(engines);
  const meta = {
    samples: clamped.samples,
    liveCalls: sum(runs.map((r) => r.meta.liveCalls)),
    cachedCalls: sum(runs.map((r) => r.meta.cachedCalls)),
    cappedCalls: sum(runs.map((r) => r.meta.cappedCalls)),
    mock: engines.some((e) => e.kind === 'mock'),
    droppedPrompts: clamped.dropped.prompts,
  };

  const result: ScanResult = {
    id: null,
    brand,
    website,
    category,
    prompts: clamped.prompts,
    score,
    engines,
    competitors,
    meta,
    createdAt: new Date().toISOString(),
  };

  result.id = await persistScan(result, runs);
  return result;
}

/** Reload a persisted scan by id. Returns null when the DB is off or the id is unknown. */
export async function loadScan(id: string): Promise<ScanResult | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  const scan = await prisma.scan.findUnique({ where: { id } });
  if (!scan?.resultJson) return null;
  // The snapshot is a faithful ScanResult; re-stamp id/createdAt from the row.
  const snapshot = scan.resultJson as unknown as ScanResult;
  return { ...snapshot, id: scan.id, createdAt: scan.createdAt.toISOString() };
}

// ── aggregation ──────────────────────────────────────────────────────────────

function aggregateEngines(runs: RunResult[]): EngineSummary[] {
  type Acc = {
    citedCount: number;
    sampleCount: number;
    positions: number[];
    competitors: Set<string>;
    citations: Set<string>;
    anyOk: boolean;
    anyNotImpl: boolean;
  };
  const byEngine = new Map<EngineName, Acc>();

  for (const run of runs) {
    for (const eng of run.engines) {
      const acc =
        byEngine.get(eng.engine) ??
        ({
          citedCount: 0,
          sampleCount: 0,
          positions: [],
          competitors: new Set<string>(),
          citations: new Set<string>(),
          anyOk: false,
          anyNotImpl: false,
        } satisfies Acc);

      acc.citedCount += eng.citedCount;
      acc.sampleCount += eng.sampleCount;
      for (const s of eng.samples) {
        if (typeof s.position === 'number') acc.positions.push(s.position);
      }
      eng.competitors.forEach((c) => acc.competitors.add(c));
      eng.citations.forEach((c) => acc.citations.add(c));
      if (eng.status === 'ok') acc.anyOk = true;
      if (eng.status === 'not_implemented') acc.anyNotImpl = true;

      byEngine.set(eng.engine, acc);
    }
  }

  const order = runs[0]?.engines.map((e) => e.engine) ?? [];
  return order.map((name) => {
    const acc = byEngine.get(name)!;
    const status: EngineSummary['status'] = acc.anyOk
      ? 'ok'
      : acc.anyNotImpl
        ? 'not_implemented'
        : 'error';
    const meta = ENGINE_META[name];
    const anySample = runs.flatMap((r) => r.engines).find((e) => e.engine === name);
    return {
      engine: name,
      displayName: meta.displayName,
      // Use the actual provider kind that ran (mock vs api), not the canonical surface kind.
      kind: anySample?.kind ?? meta.kind,
      configured: anySample?.configured ?? false,
      status,
      citedCount: acc.citedCount,
      sampleCount: acc.sampleCount,
      citationRate: acc.sampleCount === 0 ? 0 : acc.citedCount / acc.sampleCount,
      bestPosition: acc.positions.length ? Math.min(...acc.positions) : null,
      avgPosition: acc.positions.length
        ? acc.positions.reduce((a, b) => a + b, 0) / acc.positions.length
        : null,
      competitors: Array.from(acc.competitors),
      citations: Array.from(acc.citations),
    };
  });
}

function tallyCompetitors(runs: RunResult[]): CompetitorTally[] {
  const counts = new Map<string, number>();
  for (const run of runs) {
    for (const eng of run.engines) {
      for (const s of eng.samples) {
        for (const c of s.competitors) {
          counts.set(c, (counts.get(c) ?? 0) + 1);
        }
      }
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_COMPETITORS);
}

// ── persistence (graceful) ───────────────────────────────────────────────────

async function persistScan(result: ScanResult, runs: RunResult[]): Promise<string | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  try {
    const scan = await prisma.scan.create({
      data: {
        brandName: result.brand,
        website: result.website,
        category: result.category,
        prompts: result.prompts,
        visibilityScore: result.score,
        status: 'complete',
        resultJson: result as unknown as object,
        engineResults: {
          create: runs.flatMap((run) =>
            run.engines.flatMap((eng) =>
              eng.samples
                .filter((s) => s.status === 'ok')
                .map((s) => ({
                  engine: eng.engine,
                  prompt: run.prompt,
                  sampleIndex: s.index,
                  cited: s.cited,
                  position: s.position,
                  sentiment: s.sentiment,
                  citations: s.citations,
                  model: s.model,
                  text: s.text,
                })),
            ),
          ),
        },
        competitors: {
          create: result.competitors.map((c) => ({ name: c.name, count: c.count, engines: [] })),
        },
      },
    });
    return scan.id;
  } catch (err) {
    console.warn('[amicited] scan persistence failed; continuing without it:', err);
    return null;
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

function deriveAliases(brand: string, website?: string): string[] {
  const aliases = new Set<string>();
  const brandDomain = brand.match(/^([a-z0-9-]+)\.[a-z]{2,}$/i);
  if (brandDomain?.[1]) aliases.add(brandDomain[1]);
  if (website) {
    const host = website
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]!;
    aliases.add(host);
    const root = host.match(/^([a-z0-9-]+)\./i);
    if (root?.[1]) aliases.add(root[1]);
  }
  aliases.delete(brand.toLowerCase());
  return Array.from(aliases);
}

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
