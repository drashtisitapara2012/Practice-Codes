import { getGuide, getStrapiMedia, getTranslations, t } from '@/app/lib/api/strapi';
import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { ChevronLeft, BookOpen, Clock, Calendar, Copy, Hash, Code } from 'lucide-react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { cookies } from 'next/headers';

export async function generateMetadata() {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    const guide = await getGuide(locale);

    if (!guide) {
        return {
            title: 'Cheat Sheet Not Found',
        };
    }

    const { seoData } = guide;
    const shareImageData = (seoData?.shareImage as any)?.data || seoData?.shareImage;
    const shareImageUrl = getStrapiMedia(shareImageData?.url);

    return {
        title: seoData?.metaTitle || `${guide.Title} | Cheat Sheet`,
        description: seoData?.metaDescription || guide.Description,
        openGraph: shareImageUrl ? {
            images: [shareImageUrl],
        } : undefined,
    };
}

export default async function GuidePage() {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    const [guide, translations] = await Promise.all([
        getGuide(locale),
        getTranslations(locale),
    ]);

    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-black mb-4">No Cheat Sheet found for this language</h2>
                    <Link href="/articles" className="text-blue-600 hover:underline">Back to Articles</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12">
                        <div className="flex justify-between items-center mb-10">
                            <Link
                                href="/articles"
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-bold transition-all group"
                            >
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:-translate-x-1 transition-transform">
                                    <ChevronLeft size={20} />
                                </div>
                                <span>{t(translations, 'createArticle.backLink', 'Back to Articles')}</span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <LanguageSwitcher />
                                <ThemeToggle />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                                    <Copy size={24} />
                                </div>
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs uppercase tracking-widest font-black">
                                    {t(translations, 'guide.tag', 'Official Cheat Sheet')}
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                                {guide.Title}
                            </h1>

                            {guide.Description && (
                                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-indigo-600 pl-6 py-2">
                                    {guide.Description}
                                </p>
                            )}

                            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium pt-2">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>Updated: {new Date(guide.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <div className="space-y-12">
                        {/* Introductory Rich Text */}
                        {guide.Content && (
                            <main className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden">
                                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-loose">
                                    <BlocksRenderer content={guide.Content} />
                                </div>
                            </main>
                        )}
                    </div>

                    <footer className="mt-16 text-center pb-12">
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mb-8" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {t(translations, 'common.footer', '© 2026 GitHub Dashboard Content Team')}
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
