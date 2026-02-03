import { NextRequest, NextResponse } from 'next/server';
import { getRandomRecipes, searchRecipes } from '@/lib/api/recipes';

/**
 * Recipes API Route Handler
 * 
 * Demonstrates:
 * - Handling multiple query scenarios (random vs search)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const count = parseInt(searchParams.get('count') || '6', 10);

    try {
        let recipes;

        if (query) {
            recipes = await searchRecipes(query);
        } else {
            recipes = await getRandomRecipes(count);
        }

        return NextResponse.json(recipes);
    } catch (error) {
        console.error('Recipes API error:', error);

        return NextResponse.json(
            { error: 'Failed to fetch recipes', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
