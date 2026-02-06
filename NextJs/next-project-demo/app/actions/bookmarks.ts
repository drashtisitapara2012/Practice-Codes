/**
 * Bookmark Server Actions
 * 
 * Demonstrates Next.js 16 new caching APIs:
 * - updateTag() for immediate read-your-writes in Server Actions
 * - refresh() for refreshing uncached data
 * - revalidateTag() with cacheLife for background SWR revalidation
 */

'use server';

import { cookies } from 'next/headers';
import {
    updateTag,
    refresh,
    revalidateTag
} from 'next/cache';
import { USER_BOOKMARKS_TAG } from '@/lib/cache/tags';

export interface Bookmark {
    type: 'movie' | 'recipe';
    id: string;
    title: string;
    thumbnail?: string;
    addedAt: string;
}

/**
 * Get all bookmarks for the current user
 */
export async function getBookmarks(): Promise<Bookmark[]> {
    const cookieStore = await cookies();
    const bookmarksJson = cookieStore.get('bookmarks')?.value;

    if (!bookmarksJson) {
        return [];
    }

    try {
        return JSON.parse(bookmarksJson);
    } catch {
        return [];
    }
}

/**
 * Add a bookmark
 * Uses updateTag() for immediate cache update with read-your-writes semantics
 */
export async function addBookmark(bookmark: Omit<Bookmark, 'addedAt'>): Promise<{ success: boolean; message: string }> {
    try {
        const cookieStore = await cookies();
        const existing = await getBookmarks();

        // Check if already bookmarked
        const isAlreadyBookmarked = existing.some(
            b => b.type === bookmark.type && b.id === bookmark.id
        );

        if (isAlreadyBookmarked) {
            return { success: false, message: 'Already bookmarked' };
        }

        const newBookmark: Bookmark = {
            ...bookmark,
            addedAt: new Date().toISOString(),
        };

        const updated = [...existing, newBookmark];

        cookieStore.set('bookmarks', JSON.stringify(updated), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });

        // Use updateTag for immediate read-your-writes semantics
        // User sees their changes right away
        updateTag(USER_BOOKMARKS_TAG);

        return { success: true, message: 'Bookmark added' };
    } catch (error) {
        console.error('Failed to add bookmark:', error);
        return { success: false, message: 'Failed to add bookmark' };
    }
}

/**
 * Remove a bookmark
 * Uses updateTag() for immediate cache invalidation
 */
export async function removeBookmark(
    type: 'movie' | 'recipe',
    id: string
): Promise<{ success: boolean; message: string }> {
    try {
        const cookieStore = await cookies();
        const existing = await getBookmarks();

        const filtered = existing.filter(
            b => !(b.type === type && b.id === id)
        );

        if (filtered.length === existing.length) {
            return { success: false, message: 'Bookmark not found' };
        }

        cookieStore.set('bookmarks', JSON.stringify(filtered), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        });

        // Immediate cache invalidation
        updateTag(USER_BOOKMARKS_TAG);

        return { success: true, message: 'Bookmark removed' };
    } catch (error) {
        console.error('Failed to remove bookmark:', error);
        return { success: false, message: 'Failed to remove bookmark' };
    }
}

/**
 * Toggle bookmark status
 */
export async function toggleBookmark(
    bookmark: Omit<Bookmark, 'addedAt'>
): Promise<{ isBookmarked: boolean; message: string }> {
    const existing = await getBookmarks();
    const isBookmarked = existing.some(
        b => b.type === bookmark.type && b.id === bookmark.id
    );

    if (isBookmarked) {
        await removeBookmark(bookmark.type, bookmark.id);
        return { isBookmarked: false, message: 'Bookmark removed' };
    } else {
        await addBookmark(bookmark);
        return { isBookmarked: true, message: 'Bookmark added' };
    }
}

/**
 * Check if an item is bookmarked
 */
export async function isBookmarked(
    type: 'movie' | 'recipe',
    id: string
): Promise<boolean> {
    const bookmarks = await getBookmarks();
    return bookmarks.some(b => b.type === type && b.id === id);
}

/**
 * Clear all bookmarks
 */
export async function clearBookmarks(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('bookmarks');
    updateTag(USER_BOOKMARKS_TAG);
}

/**
 * Refresh notification count
 * Uses refresh() for uncached data that's displayed elsewhere on the page
 */
export async function refreshNotifications(): Promise<void> {
    // refresh() is used for uncached data like notification counts
    // It complements router.refresh() but for server actions
    refresh();
}
