/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace packages ship pre-built dist, but transpiling them keeps dev/HMR smooth and lets
  // the app consume their TS sources directly if needed.
  transpilePackages: ['@orbiqon/query-engine', '@orbiqon/entity-resolver', '@orbiqon/db'],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
