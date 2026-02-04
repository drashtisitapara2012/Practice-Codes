import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  experimental: {
    // @ts-ignore - experimental flags for the new caching system
    dynamicIO: true,
    useCache: true,
  },
};

export default nextConfig;
