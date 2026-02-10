import { StrapiArticle, StrapiResponse } from '@/app/types/strapi';
import { draftMode } from 'next/headers';

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
export async function getArticles(): Promise<StrapiArticle[]> {
    try {
        const isDraft = (await draftMode()).isEnabled;

        // Using a plain string as requested
        let query = 'fields=Title&fields=Description&fields=slug&populate=Image';

        if (isDraft) {
            query += '&status=draft';
        }

        const response = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Strapi error: ${response.status}`);
        }

        const { data }: StrapiResponse<StrapiArticle> = await response.json();
        return data || [];
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return [];
    }
}

/**
 * Fetches a single article from Strapi using its Slug.
 */
export async function getArticleBySlug(slug: string): Promise<StrapiArticle | null> {
    try {
        const isDraft = (await draftMode()).isEnabled;

        // Using a plain string as requested
        let query = `filters[slug][$eq]=${slug}&populate=*`;

        if (isDraft) {
            query += '&status=draft';
        }

        const response = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Strapi error: ${response.status}`);
        }

        const { data }: StrapiResponse<StrapiArticle> = await response.json();

        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error(`Failed to fetch article by slug "${slug}":`, error);
        return null;
    }
}
