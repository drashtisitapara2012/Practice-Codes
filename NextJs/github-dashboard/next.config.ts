import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    // @ts-ignore - experimental flags for the new caching system
    // Note: If these cause issues with your specific Next.js version, you can disable them.
    dynamicIO: true,
    useCache: true,
  },
};

export default nextConfig;
