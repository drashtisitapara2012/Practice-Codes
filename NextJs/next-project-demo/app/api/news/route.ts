import { NextRequest, NextResponse } from 'next/server';
import { getNews, type NewsCategory } from '@/lib/api/news';

/**
 * News API Route Handler
 * 
 * Demonstrates:
 * - Dynamic route parameters validation
 * - JSON response formatting
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = (searchParams.get('category') || 'technology') as NewsCategory;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    try {
        const news = await getNews(category, limit);
        return NextResponse.json(news);
    } catch (error) {
        console.error(`News API error for ${category}:`, error);

        return NextResponse.json(
            { error: 'Failed to fetch news', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
