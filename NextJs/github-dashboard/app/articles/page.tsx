import { getArticles, getStrapiMedia, getTranslations, t, getFeaturedSection } from '@/app/lib/api/strapi';
import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { BookOpen, ArrowRight, Image as ImageIcon, Calendar as CalendarIcon, Star, Sparkles, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { draftMode, cookies } from 'next/headers';

export const metadata = {
    title: 'Articles | GitHub Dashboard',
    description: 'Read the latest updates and articles from our dashboard',
};

export default async function ArticlesPage() {
    const isDraft = (await draftMode()).isEnabled;
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    // Fetch articles, translations, and curated featured section
    const [articles, translations, featuredSection] = await Promise.all([
        getArticles(isDraft, locale),
        getTranslations(locale),
        getFeaturedSection(locale),
    ]);

    // Extracts relations (handling both Strapi 4 and 5 data structures)
    const recommendedArticles = (featuredSection?.RecommendedArticles as any)?.data || featuredSection?.RecommendedArticles || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-12">
                    <div className="flex flex-col sm:row justify-between items-center gap-4 mb-10">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold hover:scale-105 transition-all text-sm whitespace-nowrap"
                            >
                                ← {t(translations, 'articles.dashboard', 'Dashboard')}
                            </Link>
                            <Link
                                href="/articles/guide"
                                className="px-5 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold hover:scale-105 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
                            >
                                <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
                                <span>{t(translations, 'articles.guideLink', 'Guide')}</span>
                            </Link>
                            <Link
                                href="/articles/calendar"
                                className="px-5 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold hover:scale-105 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
                            >
                                <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400" />
                                <span>{t(translations, 'articles.calendarLink', 'Calendar')}</span>
                            </Link>
                            <Link
                                href="/articles/create"
                                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold hover:scale-105 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
                            >
                                <span>{t(translations, 'articles.createButton', 'Create New')}</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-[10px] uppercase font-black tracking-widest mb-4">
                            <Sparkles size={12} />
                            <span>{featuredSection?.Title || t(translations, 'articles.badge', 'Featured Updates')}</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            {t(translations, 'articles.title', 'The Feed')}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {t(translations, 'articles.subtitle', 'Deep dives into engineering, design, and product strategy.')}
                        </p>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto space-y-20">
                    {/* 1. Recommended Relationship Row */}
                    {recommendedArticles.length > 0 && (
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="text-amber-500" />
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider italic">
                                    {t(translations, 'articles.recommended', 'Hand-picked for you')}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {recommendedArticles.map((article: any) => (
                                    <Link key={article.id} href={`/articles/${article.slug}`} className="group relative flex flex-col bg-white dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:border-amber-500/50 hover:shadow-2xl transition-all">
                                        <div className="absolute top-6 right-6 z-10">
                                            <div className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm">
                                                <Star size={16} className="text-amber-500 fill-amber-500" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                                {article.Image ? (
                                                    <Image
                                                        src={getStrapiMedia((article.Image as any)?.url || (article.Image as any)?.data?.url)}
                                                        alt={article.Title}
                                                        fill unoptimized
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                        <Star size={20} className="text-amber-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                                                    {article.Title}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                                    Recommended Reading
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. General Articles Grid */}
                    <section className="space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider italic">
                                {t(translations, 'articles.allPosts', 'All Posts')}
                            </h2>
                        </div>

                        {articles.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
                                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-xl font-medium text-gray-500">{t(translations, 'articles.noArticles', 'No articles found yet.')}</p>
                                <Link href="/articles/create" className="text-blue-600 font-bold hover:underline mt-4 block">
                                    {t(translations, 'articles.createFirst', 'Create Your First Post')}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {articles.map((article) => {
                                    const imageData = (article.Image as any)?.data || article.Image;
                                    const imageUrl = getStrapiMedia(imageData?.url);

                                    return (
                                        <article
                                            key={article.id}
                                            className="group bg-white dark:bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
                                        >
                                            <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={article.Title}
                                                        fill
                                                        unoptimized
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-600">
                                                        <ImageIcon size={40} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                                                    {article.Title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed text-sm">
                                                    {article.Description || t(translations, 'articles.noDescription', 'Explore the full story.')}
                                                </p>
                                                <div className="mt-auto">
                                                    <Link
                                                        href={`/articles/${article.slug}`}
                                                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm tracking-tight"
                                                    >
                                                        <span>{t(translations, 'articles.readMore', 'Read Story')}</span>
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
