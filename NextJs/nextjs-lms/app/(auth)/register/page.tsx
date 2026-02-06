'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { register } from '@/lib/actions/auth';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(register, { error: '' });

    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Create an account</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to create your account
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
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    {state?.error && (
                        <p className="text-sm font-medium text-destructive">{state.error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Register'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account? <Link href="/login" className="underline text-primary">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
