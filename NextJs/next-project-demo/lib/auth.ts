/**
 * NextAuth.js v5 Configuration
 * 
 * This is the main authentication configuration file.
 * Supports GitHub and Google OAuth providers.
 */

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        // Credentials provider for demo/testing purposes
        Credentials({
            name: 'Demo Login',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'demo@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Demo user for testing - in production, validate against a database
                if (
                    credentials?.email === 'demo@nexthub.com' &&
                    credentials?.password === 'demo123'
                ) {
                    return {
                        id: 'demo-user-1',
                        name: 'Demo User',
                        email: 'demo@nexthub.com',
                        image: 'https://avatars.githubusercontent.com/u/1?v=4',
                    };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            return true;
        },
    },
    session: {
        strategy: 'jwt',
    },
    trustHost: true,
});
