'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an observability service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-6">
                <AlertTriangle className="size-12" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong!</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                An unexpected error occurred. We&apos;ve been notified and are looking into it.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} className="gap-2">
                    <RefreshCcw className="size-4" /> Try again
                </Button>
                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <Home className="size-4" /> Go Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
