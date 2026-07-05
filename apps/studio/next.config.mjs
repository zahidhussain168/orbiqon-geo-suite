import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createMDX from '@next/mdx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withMDX = createMDX({});

// The generated Prisma client dir (rhel engine + schema) that must be copied into every
// serverless function that touches the database.
const PRISMA_ENGINE_GLOB =
  '../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // @orbiqon/config ships TS source; others ship dist. Transpiling keeps HMR smooth.
  transpilePackages: [
    '@orbiqon/config',
    '@orbiqon/query-engine',
    '@orbiqon/entity-resolver',
    '@orbiqon/db',
  ],
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // pnpm monorepo: trace from the repo root so Next bundles Prisma's query-engine binary
    // (which lives in the hoisted node_modules) into the serverless functions on Vercel.
    outputFileTracingRoot: path.join(__dirname, '../../'),
    // Keep Prisma out of the webpack bundle; require it (and its engine) from node_modules at runtime.
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    // Next's tracer misses the Prisma engine .so.node in pnpm's nested store, so force-copy the
    // whole generated-client dir (engine + schema) into every function that touches the DB.
    // Keys are globs: use `/results/**` (not `/results/[id]`) since `[id]` is read as a glob
    // character class and would never match the dynamic route.
    outputFileTracingIncludes: {
      '/api/**': [PRISMA_ENGINE_GLOB],
      '/results/**': [PRISMA_ENGINE_GLOB],
    },
  },
};

export default withMDX(nextConfig);
