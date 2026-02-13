'use client';

import {
    format,
    startOfMonth,
    endOfMonth,
    isSameDay,
    isToday,
} from 'date-fns';
import { StrapiArticle } from '@/app/types/strapi';
import Link from 'next/link';
import Image from 'next/image';
import {
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Globe,
    Layout,
    Calendar as CalendarIcon
} from 'lucide-react';
import { getStrapiMedia } from '@/app/lib/api/strapi';

interface TimelineViewProps {
    articles: StrapiArticle[];
    currentDate: Date;
    translations: Record<string, string>;
}

export default function TimelineView({ articles, currentDate, translations }: TimelineViewProps) {
    // Sort articles by date (descending)
    const sortedArticles = [...articles].sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
    });

    // Group by day
    const groupedArticles: Record<string, StrapiArticle[]> = {};
    sortedArticles.forEach(article => {
        const key = format(new Date(article.publishedAt || article.createdAt), 'yyyy-MM-dd');
        if (!groupedArticles[key]) groupedArticles[key] = [];
        groupedArticles[key].push(article);
    });

    const days = Object.keys(groupedArticles).sort((a, b) => b.localeCompare(a));

    if (days.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white/30 dark:bg-gray-800/20 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                    <CalendarIcon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No articles found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-in slide-in-from-bottom-4 duration-700">
            {days.map((dayKey, dayIdx) => {
                const date = new Date(dayKey);
                const dayArticles = groupedArticles[dayKey];

                return (
                    <div key={dayKey} className="relative pl-8 md:pl-48">
                        {/* Date Side Label (Desktop) */}
                        <div className="hidden md:flex absolute left-0 top-0 w-40 flex-col items-end pt-1">
                            <span className={`text-4xl font-black ${isToday(date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                {format(date, 'dd')}
                            </span>
                            <span className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                {format(date, 'MMM yyyy')}
                            </span>
                            <span className="text-xs font-bold text-gray-300 dark:text-gray-600 mt-1">
                                {format(date, 'EEEE')}
                            </span>
                        </div>

                        {/* Mobile Date Label */}
                        <div className="md:hidden mb-6 flex items-baseline gap-3">
                            <span className={`text-3xl font-black ${isToday(date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                {format(date, 'dd')}
                            </span>
                            <span className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                {format(date, 'MMMM yyyy')}
                            </span>
                        </div>

                        {/* Timeline Line */}
                        <div className="absolute left-[7px] md:left-[175px] top-4 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-100 to-transparent dark:from-gray-700 dark:via-gray-800 dark:to-transparent" />

                        {/* Dot */}
                        <div className={`absolute left-0 md:left-[168px] top-2 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 z-10 shadow-sm transition-colors ${isToday(date) ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`} />

                        {/* Articles for this day */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {dayArticles.map((article, artIdx) => (
                                <Link
                                    key={article.documentId}
                                    href={`/articles/${article.slug}`}
                                    className="group relative bg-white dark:bg-gray-800/40 backdrop-blur-md rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Background Decor */}
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 dark:bg-gray-900/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />

                                    <div className="flex gap-6">
                                        {/* Image Preview */}
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700 shadow-inner">
                                            {article.Image ? (
                                                <Image
                                                    src={getStrapiMedia((article.Image as any).url)}
                                                    alt={article.Title}
                                                    fill unoptimized
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                                                    <Layout size={24} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${article.publishedAt
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                                        }`}>
                                                        {article.publishedAt ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                                        {article.publishedAt ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        <Globe size={10} />
                                                        {article.locale?.toUpperCase() || 'EN'}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {article.Title}
                                                </h4>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    {format(new Date(article.publishedAt || article.createdAt), 'h:mm a')}
                                                </span>
                                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                                    <span>View</span>
                                                    <ArrowUpRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
