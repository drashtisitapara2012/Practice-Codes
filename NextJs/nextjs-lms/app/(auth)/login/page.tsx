'use client';

import { useActionState } from 'react';
import { login } from '@/lib/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, {});

    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <form action={action} className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="student@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <label htmlFor="password">Password</label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="password"
                        />
                    </div>
                    {state.errors?._form && (
                        <p className="text-sm font-medium text-destructive">
                            {state.errors._form}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <p className="text-muted-foreground">Mock Credentials:</p>
                    <ul className="mt-2 space-y-1">
                        <li>student@example.com / password</li>
                        <li>instructor@example.com / password</li>
                        <li>admin@example.com / password</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
