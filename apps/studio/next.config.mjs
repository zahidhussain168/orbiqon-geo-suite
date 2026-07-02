import createMDX from '@next/mdx';

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
};

export default withMDX(nextConfig);
