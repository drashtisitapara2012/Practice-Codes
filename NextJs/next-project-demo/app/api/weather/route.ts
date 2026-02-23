import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/api/weather';

/**
 * Weather API Route Handler
 * 
 * Demonstrates:
 * - Route Handlers (App Router equivalent of API routes)
 * - Request parameter handling
 * - Error handling
 * - Caching headers
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || 'London';

    try {
        const weather = await getWeather(city);

        // Create response with headers
        const response = NextResponse.json(weather);

        // Set caching headers explicitly if needed (though "use cache" handles internal caching)
        response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600');

        return response;
    } catch (error) {
        console.error(`Weather API error for ${city}:`, error);

        return NextResponse.json(
            { error: 'Failed to fetch weather data', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
