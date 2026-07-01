/**
 * SIGNAL CHECK — the go/no-go gate for the whole tool (build step 3.5).
 *
 * Runs the real API adapters against a couple of well-known brands and prints the raw output so a
 * human can eyeball it:
 *   • Does Claude actually name competitors?
 *   • Does Perplexity return parseable citation URLs?
 *   • Does the resolver correctly distinguish "Monday" vs "Monday.com"?
 *
 * If the raw signal is weak, STOP and fix the two core packages before building anything on top.
 *
 * Run from the package dir:  corepack pnpm --filter @orbiqon/query-engine signal-check
 * Requires real keys in the repo-root .env (and MOCK_LLM unset / false).
 */
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { EntityResolver } from '@orbiqon/entity-resolver';
import { QueryEngine } from '../src/engine.js';
import { createProviders } from '../src/providers/index.js';
import type { MentionDetector } from '../src/types.js';

// Load the repo-root .env regardless of cwd.
loadEnv({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

const CASES = [
  { brand: 'Notion', prompt: 'best note-taking app for teams' },
  { brand: 'Linear', prompt: 'best project management tool for startups' },
];

async function main() {
  const forceMock = process.env.MOCK_LLM === 'true';
  if (forceMock) {
    console.warn('⚠  MOCK_LLM=true — signal check is meaningless in mock mode. Unset it.\n');
  }

  const resolver = new EntityResolver();

  for (const testCase of CASES) {
    console.log('='.repeat(80));
    console.log(`BRAND: ${testCase.brand}   PROMPT: "${testCase.prompt}"`);
    console.log('='.repeat(80));

    const providers = createProviders({
      forceMock,
      mock: { brand: testCase.brand },
    }).filter((p) => p.kind === 'api'); // only the live adapters for the signal check

    const engine = new QueryEngine({ providers, samples: 2 });
    const detect: MentionDetector = (answer) =>
      resolver.resolve(answer.text, testCase.brand, { citations: answer.citations });

    const result = await engine.run(testCase.prompt, { detectMention: detect });

    for (const eng of result.engines) {
      console.log(`\n--- ${eng.displayName} (${eng.status}) ---`);
      if (eng.status !== 'ok') {
        console.log(`  ${eng.samples[0]?.error ?? 'no samples'}`);
        continue;
      }
      console.log(`  cited: ${eng.citedCount}/${eng.sampleCount}  (rate ${eng.citationRate.toFixed(2)})`);
      console.log(`  best position: ${eng.bestPosition ?? '—'}`);
      console.log(`  competitors: ${eng.competitors.slice(0, 8).join(', ') || '(none parsed)'}`);
      console.log(`  citation URLs: ${eng.citations.slice(0, 5).join(', ') || '(none parsed)'}`);
      console.log(`  sample text: ${truncate(eng.samples[0]?.text ?? '', 220)}`);
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('RESOLVER DISAMBIGUATION CHECK');
  console.log('='.repeat(80));
  const monday = 'I recommend Monday.com for project management; monday mornings are hard though.';
  const asMondayDotCom = resolver.resolve(monday, 'Monday.com', { aliases: ['monday'] });
  const asWeekday = resolver.resolve('I hate Monday mornings but love Fridays.', 'Monday.com');
  console.log(`  "Monday.com" in a real recommendation → cited=${asMondayDotCom.cited} (expect true)`);
  console.log(`  "Monday" as the weekday only        → cited=${asWeekday.cited} (expect false)`);
}

function truncate(s: string, n: number): string {
  const flat = s.replace(/\s+/g, ' ').trim();
  return flat.length > n ? `${flat.slice(0, n)}…` : flat;
}

main().catch((err) => {
  console.error('signal-check failed:', err);
  process.exit(1);
});
