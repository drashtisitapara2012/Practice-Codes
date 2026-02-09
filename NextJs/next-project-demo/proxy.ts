/**
 * Next.js 16: proxy.ts replaces middleware.ts
 * 
 * This file runs on the Node.js runtime and handles request interception.
 * The naming clarifies the network boundary and provides a single, predictable runtime.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/about',
        '/api/auth',
    ];

    // Check if the current path is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // API routes should be handled separately
    const isApiRoute = pathname.startsWith('/api');

    // Static files and Next.js internals
    const isStaticOrInternal =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.');

    // Skip auth check for public routes, API routes (they handle their own auth), and static files
    if (isPublicRoute || isApiRoute || isStaticOrInternal) {
        const response = NextResponse.next();
        // Add request timing header for observability
        response.headers.set('x-request-start', Date.now().toString());
        return response;
    }

    // Protected routes - check authentication
    const session = await auth();

    if (!session) {
        // Redirect to login with callback URL
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // User is authenticated, proceed with the request
    const response = NextResponse.next();
    response.headers.set('x-request-start', Date.now().toString());
    response.headers.set('x-user-id', session.user?.id || '');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};
