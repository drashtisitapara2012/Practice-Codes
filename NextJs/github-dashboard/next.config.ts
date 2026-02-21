import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //for image rendering
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
  async headers() {
    //without this browser will block iframe embedding by default
    return [
      {
        source: '/api/draft',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:1337 http://127.0.0.1:1337",
          },
        ],
      },
      {
        source: '/articles/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:1337 http://127.0.0.1:1337",
          },
        ],
      },
    ];
  },
  experimental: {
    // @ts-ignore - experimental flags for the new caching system
    // Note: If these cause issues with your specific Next.js version, you can disable them.
    dynamicIO: true,
    useCache: true,
  },
};

export default nextConfig;
