'use client';

import { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    Search,
    Filter,
    ArrowUpRight,
    Globe,
    CheckCircle2,
    History
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { StrapiArticle } from '@/app/types/strapi';
import { getStrapiMedia, t } from '@/app/lib/api/strapi';
import CalendarGrid from '@/app/components/Calendar/CalendarGrid';
import TimelineView from '@/app/components/Calendar/TimelineView';

interface CalendarContainerProps {
    initialArticles: StrapiArticle[];
    translations: Record<string, string>;
    locales: Array<{ code: string; name: string }>;
}

export type ViewMode = 'grid' | 'timeline';

export default function CalendarContainer({
    initialArticles,
    translations,
    locales
}: CalendarContainerProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('timeline');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocale, setSelectedLocale] = useState('all');

    const filteredArticles = useMemo(() => {
        return initialArticles.filter(article => {
            const matchesSearch = article.Title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLocale = selectedLocale === 'all' || article.locale === selectedLocale;
            return matchesSearch && matchesLocale;
        });
    }, [initialArticles, searchQuery, selectedLocale]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const resetToToday = () => {
        setCurrentDate(new Date());
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Control Bar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-sm ${viewMode === 'timeline'
                                ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <History size={16} />
                            <span>Timeline</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-sm ${viewMode === 'grid'
                                ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <CalendarIcon size={16} />
                            <span>Grid</span>
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block" />

                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-black min-w-[140px] text-center">
                            {monthName} {year}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <ChevronRight size={20} />
                        </button>
                        <button
                            onClick={resetToToday}
                            className="ml-2 text-xs font-bold text-blue-600 hover:underline"
                        >
                            Today
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find an article..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>

                    <select
                        value={selectedLocale}
                        onChange={(e) => setSelectedLocale(e.target.value)}
                        className="px-4 py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm"
                    >
                        <option value="all">All Languages</option>
                        {locales.map(loc => (
                            <option key={loc.code} value={loc.code}>{loc.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[600px] relative">
                {viewMode === 'grid' ? (
                    <CalendarGrid
                        articles={filteredArticles}
                        currentDate={currentDate}
                        translations={translations}
                    />
                ) : (
                    <TimelineView
                        articles={filteredArticles}
                        currentDate={currentDate}
                        translations={translations}
                    />
                )}
            </div>
        </div>
    );
}
