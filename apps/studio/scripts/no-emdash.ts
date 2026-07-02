/**
 * Fails the build if an em dash (U+2014) appears in any source file that can render a
 * user-facing string. The brand copy rule is: no em dashes, anywhere. Use commas, colons,
 * periods, or rewrite.
 *
 * Run: pnpm --filter @orbiqon/studio no-emdash
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const EM_DASH = '—';
const APP_DIR = fileURLToPath(new URL('..', import.meta.url));
const CONFIG_SRC = fileURLToPath(new URL('../../../packages/config/src', import.meta.url));

const SCAN_DIRS = [
  join(APP_DIR, 'app'),
  join(APP_DIR, 'components'),
  join(APP_DIR, 'lib'),
  CONFIG_SRC,
];
const EXTS = new Set(['.ts', '.tsx', '.mdx', '.md']);
const SKIP = new Set(['node_modules', '.next', '.turbo', 'dist']);
// This script legitimately contains the character in a comment above; skip itself.
const SELF = fileURLToPath(import.meta.url);

interface Hit {
  file: string;
  line: number;
  text: string;
}

function walk(dir: string, hits: Hit[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, hits);
    } else if (EXTS.has(extname(full)) && full !== SELF) {
      const lines = readFileSync(full, 'utf8').split('\n');
      lines.forEach((text, i) => {
        if (text.includes(EM_DASH)) hits.push({ file: full, line: i + 1, text: text.trim() });
      });
    }
  }
}

const hits: Hit[] = [];
for (const dir of SCAN_DIRS) walk(dir, hits);

if (hits.length > 0) {
  console.error(`\nno-emdash: found ${hits.length} em dash(es). Rewrite them.\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  ${h.text.slice(0, 100)}`);
  }
  process.exit(1);
}

console.log('no-emdash: clean. No em dashes in source strings.');
