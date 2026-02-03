'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming input styles are handled via utility classes or standard CSS

export function SearchInput({ className }: { className?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
                type="search"
                placeholder="Search courses..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
            />
            {isPending && (
                <div className="absolute right-3 top-3 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            )}
        </div>
    );
}
