/**
 * Cache Tags for Next.js 16
 * 
 * These constants define cache tags used with:
 * - cacheTag() in "use cache" blocks
 * - revalidateTag() for background revalidation with SWR
 * - updateTag() for immediate read-your-writes in Server Actions
 * - refresh() for refreshing uncached data
 */

// Weather cache tags
export const WEATHER_TAG = 'weather';
export const weatherTag = (city: string) => `${WEATHER_TAG}-${city.toLowerCase()}`;

// News cache tags
export const NEWS_TAG = 'news';
export const newsTag = (category: string) => `${NEWS_TAG}-${category.toLowerCase()}`;

// Movies cache tags
export const MOVIES_TAG = 'movies';
export const TRENDING_MOVIES_TAG = 'trending-movies';
export const movieTag = (id: number | string) => `movie-${id}`;

// Recipes cache tags
export const RECIPES_TAG = 'recipes';
export const RANDOM_RECIPES_TAG = 'random-recipes';
export const recipeTag = (id: string) => `recipe-${id}`;
export const recipeSearchTag = (query: string) => `recipe-search-${query.toLowerCase()}`;

// User-related cache tags
export const USER_BOOKMARKS_TAG = 'user-bookmarks';
export const USER_PREFERENCES_TAG = 'user-preferences';
export const userTag = (userId: string) => `user-${userId}`;

// All cache tags for bulk operations
export const ALL_CACHE_TAGS = [
    WEATHER_TAG,
    NEWS_TAG,
    MOVIES_TAG,
    TRENDING_MOVIES_TAG,
    RECIPES_TAG,
    RANDOM_RECIPES_TAG,
    USER_BOOKMARKS_TAG,
    USER_PREFERENCES_TAG,
] as const;
