import { getLocales } from '@/app/lib/api/strapi';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const locales = await getLocales();
        return NextResponse.json(locales);
    } catch (error) {
        console.error('Error fetching locales:', error);
        return NextResponse.json(
            [{ code: 'en', name: 'English' }],
            { status: 200 }
        );
    }
}
