'use client';

import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    isToday
} from 'date-fns';
import { StrapiArticle } from '@/app/types/strapi';
import Link from 'next/link';
import { Globe, Clock, CheckCircle2 } from 'lucide-react';

interface CalendarGridProps {
    articles: StrapiArticle[];
    currentDate: Date;
    translations: Record<string, string>;
}

export default function CalendarGrid({ articles, currentDate, translations }: CalendarGridProps) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getArticlesForDay = (day: Date) => {
        return articles.filter(article => {
            const date = new Date(article.publishedAt || article.createdAt);
            return isSameDay(date, day);
        });
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                {weekDays.map(day => (
                    <div key={day} className="py-4 text-center text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                    const dayArticles = getArticlesForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={idx}
                            className={`min-h-[140px] p-2 border-r border-b border-gray-50 dark:border-gray-800/50 transition-colors group ${!isCurrentMonth ? 'bg-gray-50/30 dark:bg-gray-900/10' : ''
                                } ${isToday(day) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-2 px-2 pt-1">
                                <span className={`text-sm font-black ${!isCurrentMonth
                                        ? 'text-gray-300 dark:text-gray-600'
                                        : isToday(day)
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {format(day, 'd')}
                                </span>
                                {isToday(day) && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                )}
                            </div>

                            <div className="space-y-1.5">
                                {dayArticles.map(article => (
                                    <Link
                                        key={article.documentId}
                                        href={`/articles/${article.slug}`}
                                        className={`block px-2 py-1.5 rounded-lg text-[10px] font-bold truncate transition-all hover:scale-105 hover:shadow-lg ${article.publishedAt
                                                ? 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50'
                                                : 'bg-amber-100/80 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {article.publishedAt ? (
                                                <CheckCircle2 size={10} className="flex-shrink-0" />
                                            ) : (
                                                <Clock size={10} className="flex-shrink-0" />
                                            )}
                                            <span className="truncate">{article.Title}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
