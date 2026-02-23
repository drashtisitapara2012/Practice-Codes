import { auth } from '@/lib/auth';

export default auth((req) => {
    const isLoggedIn = !!req.auth?.user;
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
    const isOnAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

    if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/login', req.url));
    }

    if (isOnAuthRoute && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', req.url));
    }

    return null;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


 