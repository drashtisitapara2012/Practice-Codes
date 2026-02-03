import { Suspense } from 'react';
import { getBookmarks } from '@/app/actions/bookmarks';
import { BookmarkList } from '@/components/dashboard/bookmark-list';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { Bookmark as BookmarkIcon } from 'lucide-react';

export const metadata = {
    title: 'My Bookmarks | NextHub',
    description: 'Manage your saved movies and recipes',
};

export default async function BookmarksPage() {
    const bookmarks = await getBookmarks();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <BookmarkIcon className="size-8 text-primary" />
                    Saved Favorites
                </h1>
                <p className="text-muted-foreground">
                    Quickly access the cinema and recipes you've marked as your favorites.
                </p>
            </div>

            <Suspense fallback={<LoadingSkeleton type="list" />}>
                <BookmarkList initialBookmarks={bookmarks} />
            </Suspense>
        </div>
    );
}
