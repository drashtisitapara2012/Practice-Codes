import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const PROTECTED_ROUTES = ['/student', '/instructor', '/admin'];
const SESSION_COOKIE = 'nextlms_session';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        path.startsWith(route)
    );

    if (isProtectedRoute) {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { user } = JSON.parse(sessionCookie);

            // Role-based access control
            if (path.startsWith('/admin') && user.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url)); // Unauthorized
            }
            if (path.startsWith('/instructor') && user.role !== 'instructor' && user.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
            // Student routes accessible by all logged in users for now, or stricter if needed.

        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
