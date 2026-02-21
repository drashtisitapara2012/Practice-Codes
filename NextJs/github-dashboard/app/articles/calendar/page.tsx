import { cookies } from 'next/headers';
import {
    getArticlesForCalendar,
    getTranslations,
    getLocales
} from '@/app/lib/api/strapi';
import CalendarContainer from '@/app/components/Calendar/CalendarContainer';
import Link from 'next/link';
import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';

export default async function CalendarPage() {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    const [locales, translations] = await Promise.all([
        getLocales(),
        getTranslations(locale)
    ]);

    const articles = await getArticlesForCalendar(locales.map(l => l.code));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-12">
                <div className="flex justify-between items-center mb-10">
                    <Link
                        href="/articles"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-bold transition-all group"
                    >
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:-translate-x-1 transition-transform">
                            <ChevronLeft size={20} />
                        </div>
                        <span>Back to Articles</span>
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                                <CalendarIcon size={24} />
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white">Content Calendar</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg">
                            Visualize your publishing schedule, manage drafts, and track production across all your active locales.
                        </p>
                    </div>
                </div>
            </header>

            <main>
                <CalendarContainer
                    initialArticles={articles}
                    translations={translations}
                    locales={locales}
                />
            </main>
        </div>
    );
}
