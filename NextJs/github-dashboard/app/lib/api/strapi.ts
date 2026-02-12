import { StrapiArticle, StrapiResponse } from '@/app/types/strapi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_API_URL || 'http://127.0.0.1:1337';

/**
 * Helper to get the full URL for a Strapi image.
 */
export function getStrapiMedia(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${STRAPI_URL}${url}`;
}

/**
 * Fetches articles for the list view.
 */
export async function getArticles(isDraft = false, locale?: string): Promise<StrapiArticle[]> {
    try {
        let query = 'fields=Title&fields=Description&fields=slug&populate=Image';

        if (isDraft) {
            query += '&status=draft';
        }

        if (locale) {
            query += `&locale=${locale}`;
        }

        const finalUrl = `${STRAPI_URL}/api/articles?${query}`;
        console.log(`[Strapi API] getArticles Fetching: ${finalUrl}`);

        const response = await fetch(finalUrl, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Strapi error: ${response.status}`);
        }

        const { data }: StrapiResponse<StrapiArticle> = await response.json();
        console.log(`[Strapi API] getArticles Found ${data?.length || 0} articles for locale: ${locale || 'default'}`);
        return data || [];
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return [];
    }
}

/**
 * Fetches a single article from Strapi using its Slug.
 */
/**
 * Fetches available locales from Strapi i18n plugin.
 * Returns empty array on error - UI should handle gracefully.
 */
export async function getLocales(): Promise<Array<{ code: string; name: string }>> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/i18n/locales`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`[Strapi API] Failed to fetch locales: ${response.status} ${response.statusText}`);
            return [];
        }

        const result = await response.json();

        // Strapi can return either a direct array or { data: [...] }
        const localesArray = Array.isArray(result) ? result : result.data;

        if (!localesArray || !Array.isArray(localesArray)) {
            console.error('[Strapi API] Unexpected response format from Strapi locales endpoint:', result);
            return [];
        }

        console.log(`[Strapi API] Fetched ${localesArray.length} locales from Strapi:`, localesArray.map(l => l.code).join(', '));

        return localesArray.map((locale: any) => ({
            code: locale.code,
            name: locale.name,
        }));
    } catch (error) {
        console.error('[Strapi API] Failed to fetch locales:', error);
        return [];
    }
}

export async function getArticleBySlug(slug: string, isDraft = false, locale?: string): Promise<StrapiArticle | null> {
    try {
        let query = `filters[slug][$eq]=${slug}&populate=*`;

        if (isDraft) {
            query += '&status=draft';
        }

        if (locale) {
            query += `&locale=${locale}`;
        }

        const finalUrl = `${STRAPI_URL}/api/articles?${query}`;
        console.log(`[Strapi API] getArticleBySlug Fetching: ${finalUrl}`);

        const response = await fetch(finalUrl, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Strapi error: ${response.status}`);
        }

        const { data }: StrapiResponse<StrapiArticle> = await response.json();
        console.log(`[Strapi API] getArticleBySlug Found: ${data && data.length > 0 ? 'YES' : 'NO'} for slug: ${slug}, locale: ${locale || 'default'}`);

        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error(`Failed to fetch article by slug "${slug}":`, error);
        return null;
    }
}
