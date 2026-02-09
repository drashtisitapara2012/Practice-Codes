import { NextRequest, NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/api/movies';

/**
 * Movies API Route Handler
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const timeWindow = (searchParams.get('window') || 'week') as 'day' | 'week';

    try {
        const movies = await getTrendingMovies(timeWindow);
        console.log('API route hit: /api/movies');

        return NextResponse.json(movies);
    } catch (error) {
        console.error('Movies API error:', error);

        return NextResponse.json(
            { error: 'Failed to fetch movies', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
