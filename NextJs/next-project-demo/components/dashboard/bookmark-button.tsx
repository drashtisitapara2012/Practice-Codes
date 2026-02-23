'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Loader2 } from 'lucide-react';
import { toggleBookmark, isBookmarked as checkIsBookmarked } from '@/app/actions/bookmarks';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
    type: 'movie' | 'recipe';
    id: string;
    title: string;
    thumbnail?: string;
}

/**
 * Bookmark Button - Client Component
 * 
 * Demonstrates:
 * - Interaction with Server Actions
 * - Loading states with useTransition
 * - Reactive UI updates
 */
export function BookmarkButton({ type, id, title, thumbnail }: BookmarkButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isBookmarkedState, setIsBookmarkedState] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Check initial bookmark status
    useEffect(() => {
        async function checkStatus() {
            try {
                const bookmarked = await checkIsBookmarked(type, id);
                setIsBookmarkedState(bookmarked);
            } finally {
                setIsChecking(false);
            }
        }
        checkStatus();
    }, [type, id]);

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleBookmark({ type, id, title, thumbnail });
            setIsBookmarkedState(result.isBookmarked);
        });
    };

    if (isChecking) {
        return (
            <Button variant="outline" size="lg" disabled className="gap-2">
                <Loader2 className="size-4 animate-spin" />
                Checking...
            </Button>
        );
    }

    return (
        <Button
            variant={isBookmarkedState ? 'default' : 'outline'}
            size="lg"
            className={cn(
                'gap-2 transition-all duration-300',
                isBookmarkedState && 'bg-primary text-primary-foreground border-primary'
            )}
            onClick={handleToggle}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Bookmark className={cn('size-4', isBookmarkedState && 'fill-current')} />
            )}
            {isBookmarkedState ? 'Bookmarked' : 'Add Bookmark'}
        </Button>
    );
}
