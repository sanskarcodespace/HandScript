import type { NextConfig } from 'next';

/**
 * Next.js Configuration for HandNote AI
 * 
 * Future Features to be added:
 * - Image optimization configurations (formats, sizes)
 * - Bundle analysis plugins integration
 * - Security headers configuration
 * - Internationalization (i18n) setup
 * - PWA configurations
 */
const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'your-s3-bucket-domain.s3.amazonaws.com',
      //   pathname: '/**',
      // }
    ],
  },
  async redirects() {
    return [
      // Authentication redirects handled client-side via middleware.ts usually,
      // but if server-side auth check is available at root:
      // {
      //   source: '/',
      //   has: [{ type: 'cookie', key: 'token' }], // example
      //   destination: '/dashboard',
      //   permanent: false,
      // },
    ];
  },
};

export default nextConfig;
