import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    dynamicIO: true,
    // Add based on the specific error message provided
    cacheComponents: true,
  } as any,
};

export default nextConfig;
