import { StrapiArticle, StrapiResponse, StrapiGuide, StrapiFeaturedSection } from '@/app/types/strapi';

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
 * Fetches ALL articles for the calendar view (including drafts) and all locales.
 */
export async function getArticlesForCalendar(locales: string[]): Promise<StrapiArticle[]> {
    try {
        const fields = 'fields=Title&fields=slug&fields=createdAt&fields=publishedAt&fields=locale';
        const populate = 'populate=Image';

        // Construct locale query parameters: &locale=en&locale=fr...
        const localeQuery = locales.length > 0
            ? locales.map(code => `locale=${code}`).join('&')
            : 'locale=all';

        // Fetch published articles to get correct publishedAt dates
        const publishedUrl = `${STRAPI_URL}/api/articles?${fields}&${populate}&status=published&${localeQuery}`;
        // Fetch all (including drafts) to get the latest content
        const draftUrl = `${STRAPI_URL}/api/articles?${fields}&${populate}&status=draft&${localeQuery}`;

        console.log(`[Strapi API] getArticlesForCalendar Fetching: ${publishedUrl} AND ${draftUrl}`);

        const [pubRes, draftRes] = await Promise.all([
            fetch(publishedUrl, { cache: 'no-store' }),
            fetch(draftUrl, { cache: 'no-store' })
        ]);

        if (!pubRes.ok || !draftRes.ok) {
            throw new Error(`Strapi error: ${pubRes.status} / ${draftRes.status}`);
        }

        const pubData: StrapiResponse<StrapiArticle> = await pubRes.json();
        const draftData: StrapiResponse<StrapiArticle> = await draftRes.json();

        //It takes the latest version of every article (drafts) and injects the real publish date from the published versions, if the article was ever published.
        // Map published articles by documentId to store real publishedAt dates
        const publishedMap = new Map<string, string>();
        pubData.data.forEach(article => {
            if (article.publishedAt) {
                publishedMap.set(article.documentId, article.publishedAt);
            }
        });

        // Use draft articles as base (they are the latest) and update publishedAt if they exist in publishedMap
        const mergedArticles = draftData.data.map(article => ({
            ...article,
            publishedAt: publishedMap.get(article.documentId) || null
        }));

        console.log(`[Strapi API] getArticlesForCalendar Found ${mergedArticles.length} articles across locales`);
        return mergedArticles;
    } catch (error) {
        console.error('Failed to fetch articles for calendar:', error);
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

/**
 * Fetches UI translations from Strapi for the given locale.
 * Returns a key-value object for easy lookup.
 */
export async function getTranslations(locale: string = 'en'): Promise<Record<string, string>> {
    try {
        let query = `populate=*&locale=${locale}`;
        const finalUrl = `${STRAPI_URL}/api/translations?${query}`;
        console.log(`[Strapi API] getTranslations Fetching: ${finalUrl}`);

        const response = await fetch(finalUrl, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`[Strapi API] Failed to fetch translations: ${response.status}`);
            return {};
        }

        const { data }: StrapiResponse<any> = await response.json();

        // Convert array to key-value object
        const translations: Record<string, string> = {};
        if (data && Array.isArray(data)) {
            data.forEach((item: any) => {
                if (item.key && item.value) {
                    translations[item.key] = item.value;
                }
            });
        }

        console.log(`[Strapi API] getTranslations Loaded ${Object.keys(translations).length} translations for locale: ${locale}`);
        return translations;
    } catch (error) {
        console.error('[Strapi API] Failed to fetch translations:', error);
        return {};
    }
}

/**
 * Fetches the Guide single-type content.
 */
export async function getGuide(locale?: string): Promise<StrapiGuide | null> {
    try {
        const fetchLocale = locale || 'en';
        // Single types are fetched via /api/<singular-name>
        const url = `${STRAPI_URL}/api/guide?locale=${fetchLocale}&populate=*`;

        console.log(`[Strapi API] getGuide Fetching: ${url}`);

        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            console.error(`[Strapi API] Failed to fetch guide: ${response.status}`);
            return null;
        }

        const data = await response.json();

        // Single types return { data: { ... } } directly, not an array
        return data.data;
    } catch (error) {
        console.error('[Strapi API] Error fetching guide:', error);
        return null;
    }
}

/**
 * Fetches the Featured Section single-type with its relationships (Hero and Recommended articles).
 */
export async function getFeaturedSection(locale?: string): Promise<StrapiFeaturedSection | null> {
    try {
        const fetchLocale = locale || 'en';
        // Featured Section relationship population requires deep populate
        // Specifically: RecommendedArticles (fields + Image)
        const populateRecs = 'populate[RecommendedArticles][populate][0]=Image';
        const url = `${STRAPI_URL}/api/featured-section?locale=${fetchLocale}&${populateRecs}`;

        console.log(`[Strapi API] getFeaturedSection Fetching: ${url}`);

        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            console.error(`[Strapi API] Failed to fetch featured section: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('[Strapi API] Error fetching featured section:', error);
        return null;
    }
}

/**
 * Helper function to get a translation with fallback
 */
export function t(translations: Record<string, string>, key: string, fallback: string): string {
    return translations[key] || fallback;
}
