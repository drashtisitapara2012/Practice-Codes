import { NextRequest, NextResponse } from 'next/server';
import { getGitHubUsers } from '@/app/lib/api/github';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const since = parseInt(searchParams.get('since') || '0', 10);
        const perPage = parseInt(searchParams.get('per_page') || '30', 10);

        const users = await getGitHubUsers(since, perPage);

        return NextResponse.json({
            success: true,
            data: users,
        });

    } catch (error) {
        console.error('Users API error:', error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
