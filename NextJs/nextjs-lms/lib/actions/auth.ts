'use server';

import { redirect } from 'next/navigation';
import { createSession, MOCK_USERS } from '../auth';
import { UserRole } from '../types';

export type LoginState = {
    errors?: {
        email?: string[];
        password?: string[];
        _form?: string[];
    };
    message?: string;
};

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate fields (Basic validation)
    if (!email || !password) {
        return {
            errors: {
                _form: ['Missing email or password'],
            },
        };
    }

    // Check user in DB
    const { db } = await import('@/lib/db');
    const user = await db.users.find(email);

    if (!user || password !== 'password') {
        return {
            errors: {
                _form: ['Invalid credentials or user not found.'],
            },
        };
    }

    await createSession(user);

    // Redirect based on role
    let redirectPath = '/';
    switch (user.role) {
        case 'student':
            redirectPath = '/student';
            break;
        case 'instructor':
            redirectPath = '/instructor';
            break;
        case 'admin':
            redirectPath = '/admin';
            break;
    }

    redirect(redirectPath);
}

export async function logout() {
    const { deleteSession } = await import('../auth');
    await deleteSession();
    redirect('/');
}

import { User } from '../types';

export async function register(prevState: any, formData: FormData) {
    const { db } = await import('@/lib/db');
    const { createSession } = await import('../auth');
    const { randomUUID } = await import('crypto');

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    // Default to student for registration
    const role = 'student';

    if (!email || !password) {
        return { error: 'Missing fields' };
    }

    const existingUser = await db.users.find(email);
    if (existingUser) {
        return { error: 'User already exists' };
    }

    const newUser: User = {
        id: randomUUID(),
        name: email.split('@')[0],
        email,
        role,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    await db.users.create(newUser);
    await createSession(newUser);

    redirect('/student');
}
