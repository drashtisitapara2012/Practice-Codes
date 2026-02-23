import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
            <div className="p-4 rounded-full bg-muted text-muted-foreground mb-6">
                <FileQuestion className="size-12" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Page Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                The page you looking for doesn't exist or has been moved to a new location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                    <Button className="w-full sm:w-auto gap-2">
                        <Home className="size-4" /> Go to Homepage
                    </Button>
                </Link>
                <Button variant="ghost" className="w-full sm:w-auto gap-2" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="size-4" /> Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );
}
