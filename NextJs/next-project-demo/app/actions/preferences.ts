/**
 * User Preferences Server Actions
 * 
 * Demonstrates Server Actions with form handling and cache invalidation
 */

'use server';

import { cookies } from 'next/headers';
import { updateTag } from 'next/cache';
import { USER_PREFERENCES_TAG } from '@/lib/cache/tags';

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultCity: string;
    newsCategory: string;
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        weekly: boolean;
    };
}

const defaultPreferences: UserPreferences = {
    theme: 'system',
    defaultCity: 'London',
    newsCategory: 'technology',
    language: 'en',
    notifications: {
        email: true,
        push: false,
        weekly: true,
    },
};

/**
 * Get user preferences
 */
export async function getPreferences(): Promise<UserPreferences> {
    const cookieStore = await cookies();
    const prefsJson = cookieStore.get('preferences')?.value;

    if (!prefsJson) {
        return defaultPreferences;
    }

    try {
        return { ...defaultPreferences, ...JSON.parse(prefsJson) };
    } catch {
        return defaultPreferences;
    }
}

/**
 * Update user preferences
 * Uses updateTag() for immediate cache invalidation
 */
export async function updatePreferences(
    updates: Partial<UserPreferences>
): Promise<{ success: boolean; preferences: UserPreferences }> {
    try {
        const cookieStore = await cookies();
        const current = await getPreferences();

        const updated: UserPreferences = {
            ...current,
            ...updates,
            notifications: {
                ...current.notifications,
                ...(updates.notifications || {}),
            },
        };

        cookieStore.set('preferences', JSON.stringify(updated), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });

        // Immediate cache invalidation for read-your-writes
        updateTag(USER_PREFERENCES_TAG);

        return { success: true, preferences: updated };
    } catch (error) {
        console.error('Failed to update preferences:', error);
        const current = await getPreferences();
        return { success: false, preferences: current };
    }
}

/**
 * Update theme preference
 */
export async function updateTheme(
    theme: 'light' | 'dark' | 'system'
): Promise<void> {
    await updatePreferences({ theme });
}

/**
 * Update default city for weather
 */
export async function updateDefaultCity(city: string): Promise<void> {
    await updatePreferences({ defaultCity: city });
}

/**
 * Update notification settings
 */
export async function updateNotifications(
    notifications: Partial<UserPreferences['notifications']>
): Promise<void> {
    const current = await getPreferences();
    await updatePreferences({
        notifications: { ...current.notifications, ...notifications },
    });
}

/**
 * Reset preferences to defaults
 */
export async function resetPreferences(): Promise<UserPreferences> {
    const cookieStore = await cookies();
    cookieStore.delete('preferences');
    updateTag(USER_PREFERENCES_TAG);
    return defaultPreferences;
}
