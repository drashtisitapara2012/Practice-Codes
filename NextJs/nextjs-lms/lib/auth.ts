import { cookies } from 'next/headers';
import { User, UserRole } from './types';

const SESSION_COOKIE = 'nextlms_session';

export async function createSession(user: User) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = JSON.stringify({ user, expiresAt });

    // Use 'await' for cookies() in Next.js 15+ (and 16 potentially)
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession(): Promise<{ user: User } | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;

    if (!session) return null;

    try {
        const { user, expiresAt } = JSON.parse(session);
        if (new Date(expiresAt) < new Date()) {
            return null;
        }
        return { user };
    } catch (error) {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

// Mock user database
export const MOCK_USERS: Record<string, User> = {
    'student@example.com': {
        id: 'u1',
        name: 'Alice Student',
        email: 'student@example.com',
        role: 'student',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    },
    'instructor@example.com': {
        id: 'u2',
        name: 'Bob Instructor',
        email: 'instructor@example.com',
        role: 'instructor',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    },
    'admin@example.com': {
        id: 'u3',
        name: 'Carol Admin',
        email: 'admin@example.com',
        role: 'admin',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    },
};
