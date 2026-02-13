'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/app/lib/store';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

// Flag mapping for common locales
const flagMap: Record<string, string> = {
    en: '🇺🇸',
    fr: '🇫🇷',
    es: '🇪🇸',
    de: '🇩🇪',
    it: '🇮🇹',
    pt: '🇵🇹',
    ja: '🇯🇵',
    zh: '🇨🇳',
    ar: '🇸🇦',
    ru: '🇷🇺',
};

export default function LanguageSwitcher() {
    const { locale, setLocale } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);
    const [locales, setLocales] = useState<Array<{ code: string; name: string; flag: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch available locales from Strapi
    useEffect(() => {
        setIsLoading(true);
        fetch('/api/locales')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const localesWithFlags = data.map((l: { code: string; name: string }) => ({
                        ...l,
                        flag: flagMap[l.code] || '🌐',
                    }));
                    setLocales(localesWithFlags);
                    console.log(`[LanguageSwitcher] Loaded ${data.length} locales:`, data.map((l: any) => l.code).join(', '));
                } else {
                    console.error('[LanguageSwitcher] No locales returned from API');
                }
            })
            .catch(err => {
                console.error('[LanguageSwitcher] Failed to fetch locales:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Sync with cookie for server components
    const handleLocaleChange = (newLocale: string) => {
        setLocale(newLocale);
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year  path=/ means Available to entire site
        setIsOpen(false);
        // Refresh to apply to server components
        window.location.reload();
    };

    const currentLocale = locales.find(l => l.code === locale) || locales[0];

    // Don't render if no locales available
    if (!isLoading && locales.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading || locales.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold hover:scale-105 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Languages size={18} className="text-blue-600" />
                {isLoading ? (
                    <span className="hidden sm:inline">Loading...</span>
                ) : currentLocale ? (
                    <>
                        <span className="hidden sm:inline">{currentLocale.name}</span>
                        <span className="sm:hidden">{currentLocale.code.toUpperCase()}</span>
                    </>
                ) : (
                    <span className="hidden sm:inline">Language</span>
                )}
                <ChevronDown size={14} className={clsx('transition-transform', isOpen && 'rotate-180')} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in zoom-in duration-200">
                        {locales.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleLocaleChange(l.code)}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors",
                                    locale === l.code
                                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span>{l.flag}</span>
                                    <span>{l.name}</span>
                                </div>
                                {locale === l.code && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
