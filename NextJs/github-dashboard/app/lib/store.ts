import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    // Search & Pagination
    searchQuery: string;
    pageIndex: number;
    setSearchQuery: (query: string) => void;
    setPageIndex: (index: number) => void;
    resetPagination: () => void;

    // Theme
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;

    // Internationalization (i18n)
    locale: string;
    setLocale: (locale: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Search & Pagination Defaults
            searchQuery: '',
            pageIndex: 0,
            setSearchQuery: (query) => set({ searchQuery: query, pageIndex: 0 }),
            setPageIndex: (index) => set({ pageIndex: index }),
            resetPagination: () => set({ pageIndex: 0 }),

            // Theme Defaults
            theme: 'system',
            setTheme: (theme) => set({ theme }),

            // i18n Defaults
            locale: 'en',
            setLocale: (locale) => set({ locale }),
        }),
        {
            name: 'github-dashboard-storage', // name of the item in storage (must be unique)
        }
    )
);
