import Link from 'next/link';
import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
    title: 'Sign Up | NextHub',
    description: 'Create a new account on NextHub',
};

export default function RegisterPage() {
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
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Or{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:text-primary/90 transition-colors"
                        >
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                <RegisterForm />
            </div>
        </div>
    );
}
