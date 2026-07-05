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
  },
};

export default withMDX(nextConfig);
