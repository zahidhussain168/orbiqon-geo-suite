import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createMDX from '@next/mdx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withMDX = createMDX({});

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
    outputFileTracingIncludes: {
      '/api/dbcheck': ['../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*'],
      '/api/waitlist': ['../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*'],
      '/api/lead': ['../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*'],
      '/api/scan': ['../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*'],
      '/results/[id]': ['../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**/*'],
    },
  },
};

export default withMDX(nextConfig);
