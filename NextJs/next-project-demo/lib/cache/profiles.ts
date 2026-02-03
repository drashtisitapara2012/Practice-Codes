/**
 * Cache Life Profiles for Next.js 16
 * 
 * These profiles define different caching strategies using the new
 * cacheLife API introduced in Next.js 16.
 * 
 * Built-in profiles:
 * - 'default': Standard caching
 * - 'seconds': Very short cache (15 seconds)
 * - 'minutes': Short cache (5 minutes)
 * - 'hours': Medium cache (1 hour)
 * - 'days': Long cache (1 day)
 * - 'weeks': Extended cache (1 week)
 * - 'max': Maximum cache duration
 */

// Custom cache profiles for specific use cases
export const CACHE_PROFILES = {
    // Weather data - updates frequently but not real-time
    weather: { stale: 300, revalidate: 60, expire: 3600 }, // 5min stale, 1min revalidate, 1hr expire

    // News - fresh content is important
    news: { stale: 180, revalidate: 30, expire: 900 }, // 3min stale, 30s revalidate, 15min expire

    // Movies - data changes infrequently
    movies: { stale: 3600, revalidate: 300, expire: 86400 }, // 1hr stale, 5min revalidate, 24hr expire

    // Recipes - static-ish content
    recipes: { stale: 86400, revalidate: 3600, expire: 604800 }, // 24hr stale, 1hr revalidate, 7d expire

    // User preferences - needs to be fresh after changes
    userPrefs: { stale: 0, revalidate: 0, expire: 300 }, // No stale, no revalidate delay, 5min expire
} as const;

export type CacheProfileKey = keyof typeof CACHE_PROFILES;
