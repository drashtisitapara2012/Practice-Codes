import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16: Cache Components with Partial Pre-Rendering (PPR)
  cacheComponents: true,

  // React Compiler for automatic memoization
  reactCompiler: true,

  experimental: {
    // Turbopack file system caching (stable in 16.1)
    turbopackFileSystemCacheForDev: true,
  },

  // Image optimization with remote patterns
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'openweathermap.org' },
      { protocol: 'https', hostname: 'www.themealdb.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // Logging improvements (Next.js 16)
  logging: {
    fetches: { fullUrl: true },
  },
};

export default nextConfig;
