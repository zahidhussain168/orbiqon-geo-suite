# Orbiqon GEO Suite

Tools that help a brand get **named and cited inside AI answers** (ChatGPT, Claude, Perplexity,
Gemini, Google AI Overviews).

This monorepo starts with **Tool 1 - AmICited**: a free, top-of-funnel checker. Type a brand +
a few prompts, and it tells you whether the AIs cite you, who gets named instead, and where you
rank.

## Architecture

Two packages are the **reusable core** of the whole suite (every future tool plugs into them).
They are framework-agnostic and contain **no app-specific code**:

- **`@orbiqon/query-engine`** - "ask the AIs and read the answer." Given a prompt, it queries
  each engine _N_ times and reports a citation **rate** (not a fake yes/no), with the named
  brands, cited URLs, and ordering. Cost is controlled by a per-scan call cap + caching.
- **`@orbiqon/entity-resolver`** - "did they mean us?" Fuzzy-matches brand names (aliases,
  domains, misspellings), extracts competitors + cited URLs, and computes rank + sentiment.

Supporting packages / apps:

- **`@orbiqon/db`** - shared Prisma client + schema (Supabase Postgres).
- **`apps/amicited`** - Next.js 14 (App Router) front-end. A thin UI over the two core packages.

```
packages/query-engine   ← reusable core
packages/entity-resolver ← reusable core
packages/db             ← shared Prisma client
apps/amicited           ← Next.js front-end (thin)
```

## Getting started

```bash
# pnpm via corepack (no global install needed)
corepack pnpm install

# copy env (works with zero keys — runs in MOCK mode)
cp .env.example .env

# run everything
corepack pnpm dev
# → AmICited at http://localhost:3000
```

### Modes

- **Mock mode** (default, no keys): deterministic fake AI answers so you can develop the whole
  flow offline. Set `MOCK_LLM=true` or just leave the API keys blank.
- **Live mode**: fill in `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
  `PERPLEXITY_API_KEY` in `.env` and set `MOCK_LLM=false`. Google AI Overviews + ChatGPT web UI
  are stubbed ("coming soon") in this pass - headless scraping is deferred.
- **Persistence**: fill `DATABASE_URL` / `DIRECT_URL` (Supabase). Without them, scans still run
  and render; they just aren't saved.

## Commands

| Command | What it does |
| --- | --- |
| `corepack pnpm dev` | Run the app + watch packages |
| `corepack pnpm build` | Build all packages + app |
| `corepack pnpm test` | Run package unit tests (offline, mock-based) |
| `corepack pnpm typecheck` | Type-check the workspace |
| `corepack pnpm --filter @orbiqon/query-engine signal-check` | Real-key smoke test (needs keys) |

## Honesty guardrails (baked in)

- Citation is always reported as a **rate from multiple samples**, never a fake yes/no.
- We never claim schema / llms.txt "gets you cited." Not relevant to this tool, but it's the
  suite's rule.
- AI answers swing over time - nothing here guarantees inclusion.
