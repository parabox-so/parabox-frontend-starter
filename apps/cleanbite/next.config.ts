import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@parabox/ui',
    '@parabox/canvas',
    '@parabox/realtime',
    '@parabox/auth',
    '@parabox/api-client',
  ],
};

export default nextConfig;
