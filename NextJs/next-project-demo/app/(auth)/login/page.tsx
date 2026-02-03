import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Sign In | NextHub',
    description: 'Sign in to access your dashboard',
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            NextHub
                        </h1>
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Or{' '}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:text-primary/90 transition-colors"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
                    <LoginForm />
                </Suspense>

                <div className="text-center text-xs text-muted-foreground">
                    <p>Demo credentials:</p>
                    <p>Email: demo@nexthub.com</p>
                    <p>Password: demo123</p>
                </div>
            </div>
        </div>
    );
}
