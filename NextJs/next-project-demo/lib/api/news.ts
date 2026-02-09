/**
 * News API Client using NewsData.io
 * 
 * Demonstrates Next.js 16 Cache Components with short TTL caching
 * for frequently changing content
 */

import { cacheLife, cacheTag } from 'next/cache';
import { newsTag } from '@/lib/cache/tags';

export interface NewsArticle {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    url: string;
    imageUrl: string | null;
    source: string;
    category: string[];
    publishedAt: string;
    author: string | null;
}

export type NewsCategory =
    | 'top'
    | 'business'
    | 'technology'
    | 'entertainment'
    | 'sports'
    | 'science'
    | 'health';

/**
 * Get news articles by category
 * Uses short cache duration for fresh news content
 */
export async function getNews(
    category: NewsCategory = 'top',
    limit: number = 10
): Promise<NewsArticle[]> {
    'use cache';
    cacheLife('minutes'); // Built-in profile: 5 minute cache
    cacheTag(newsTag(category));

    const apiKey = process.env.NEWSDATA_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        return getMockNews(category, limit);
    }

    try {
        // Use the latest endpoint with better tier compatibility
        let url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en`;
        if (category && category !== 'top') {
            url += `&category=${category}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 422) {
                // If 422 occurs, try fetching without category as a fallback
                console.warn('News API 422: Retrying without category filter...');
                const retryResponse = await fetch(`https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en`);
                if (retryResponse.ok) {
                    const data = await retryResponse.json();
                    return processNewsResults(data, category);
                }
            }
            console.error(`News API error: ${response.status} ${response.statusText}`);
            return getMockNews(category, limit);
        }

        const data = await response.json();
        return processNewsResults(data, category);
    } catch (error) {
        console.error('News fetch error:', error);
        return getMockNews(category, limit);
    }
}

// Helper to process and map news results
function processNewsResults(data: any, category: string): NewsArticle[] {
    if (data.status !== 'success') {
        console.error('News API returned error status:', data.results?.message || 'Unknown error');
        return [];
    }

    return (data.results || []).map((article: any, index: number) => ({
        id: article.article_id || `news-${index}`,
        title: article.title || 'Untitled',
        description: article.description,
        content: article.content,
        url: article.link || '#',
        imageUrl: article.image_url,
        source: article.source_name || article.source_id || 'Unknown',
        category: article.category || [category],
        publishedAt: article.pubDate || new Date().toISOString(),
        author: article.creator?.[0] || null,
    }));
}

/**
 * Search news by query
 */
export async function searchNews(query: string, limit: number = 10): Promise<NewsArticle[]> {
    'use cache';
    cacheLife('minutes');
    cacheTag(`news-search-${query.toLowerCase()}`);

    const apiKey = process.env.NEWSDATA_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        return getMockNews('top', limit).filter(a =>
            a.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    try {
        const response = await fetch(
            `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en`
        );

        if (!response.ok) {
            console.error(`News search error: ${response.status} ${response.statusText}`);
            return getMockNews('top', limit).filter(a =>
                a.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        const data = await response.json();

        return (data.results || []).map((article: any, index: number) => ({
            id: article.article_id || `news-${index}`,
            title: article.title || 'Untitled',
            description: article.description,
            content: article.content,
            url: article.link || '#',
            imageUrl: article.image_url,
            source: article.source_name || 'Unknown',
            category: article.category || [],
            publishedAt: article.pubDate || new Date().toISOString(),
            author: article.creator?.[0] || null,
        }));
    } catch (error) {
        console.error('News search fetch error:', error);
        return getMockNews('top', limit).filter(a =>
            a.title.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// Mock news data for when API key is not configured
function getMockNews(category: NewsCategory, limit: number): NewsArticle[] {
    const mockArticles: NewsArticle[] = [
        {
            id: '1',
            title: 'Next.js 16 Released with Revolutionary Cache Components',
            description: 'The latest version of Next.js introduces Cache Components, a new way to handle caching in React applications with unprecedented control and flexibility.',
            content: null,
            url: 'https://nextjs.org/blog/next-16',
            imageUrl: 'https://nextjs.org/static/twitter-cards/home.jpg',
            source: 'Next.js Blog',
            category: ['technology'],
            publishedAt: new Date().toISOString(),
            author: 'Vercel Team',
        },
        {
            id: '2',
            title: 'React 19.2 Brings View Transitions to the Web',
            description: 'The React team has shipped View Transitions, enabling smooth animations between page navigations without complex JavaScript.',
            content: null,
            url: 'https://react.dev',
            imageUrl: null,
            source: 'React Blog',
            category: ['technology'],
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            author: 'React Team',
        },
        {
            id: '3',
            title: 'Turbopack Becomes Default Bundler in Next.js',
            description: 'After years of development, Turbopack is now stable and the default bundler for all Next.js applications, offering 5-10x faster builds.',
            content: null,
            url: 'https://turbopack.dev',
            imageUrl: null,
            source: 'Turbopack',
            category: ['technology'],
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            author: 'Vercel Team',
        },
        {
            id: '4',
            title: 'AI-Powered Development Tools Are Reshaping Coding',
            description: 'New AI tools are enabling developers to write code faster and with fewer bugs, fundamentally changing how software is built.',
            content: null,
            url: '#',
            imageUrl: null,
            source: 'Tech Weekly',
            category: ['technology', 'business'],
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
            author: 'Jane Smith',
        },
        {
            id: '5',
            title: 'The Future of Server Components in Modern Web Apps',
            description: 'Server Components are changing how we think about the client-server boundary, enabling new patterns for building performant applications.',
            content: null,
            url: '#',
            imageUrl: null,
            source: 'Web Dev Weekly',
            category: ['technology'],
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
            author: 'John Doe',
        },
    ];

    return mockArticles.slice(0, limit);
}
