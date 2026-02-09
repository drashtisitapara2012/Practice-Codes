const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

/**
 * Helper to get the full URL for a Strapi image.
 * This version is safe for both Client and Server components.
 */
export function getStrapiMedia(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${STRAPI_URL}${url}`;
}

/**
 * Fetches an article by slug on the client side.
 * This does NOT use next/headers so it's safe for Client Components.
 */
export async function getArticleBySlugClient(slug: string) {
    try {
        const query = `filters[slug][$eq]=${slug}&populate=*`;
        const response = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Strapi error: ${response.status}`);
        }

        const { data } = await response.json();
        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error(`Client fetch error for slug "${slug}":`, error);
        return null;
    }
}
