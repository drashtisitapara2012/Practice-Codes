import { getArticleBySlug, getStrapiMedia } from '@/app/lib/api/strapi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Columns, Eye, History, AlertCircle } from 'lucide-react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import ThemeToggle from '@/app/components/ThemeToggle';
import PublishArticleButton from '@/app/components/PublishArticleButton';

interface PreviewPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ locale?: string }>;
}

export default async function ArticlePreviewPage({ params, searchParams }: PreviewPageProps) {
    const { slug } = await params;
    const { locale } = await searchParams;

    // Fetch both versions
    const draft = await getArticleBySlug(slug, true, locale);
    const published = await getArticleBySlug(slug, false, locale);

    if (!draft) {
        notFound();
    }

    const draftImageData = (draft.Image as any)?.data || draft.Image;
    const draftImageUrl = getStrapiMedia(draftImageData?.url);

    const publishedImageData = published ? ((published.Image as any)?.data || published.Image) : null;
    const publishedImageUrl = publishedImageData ? getStrapiMedia(publishedImageData?.url) : null;

    // Check if modified
    const isModified = !published ||
        draft.Title !== published.Title ||
        draft.Description !== published.Description ||
        JSON.stringify(draft.Content) !== JSON.stringify(published.Content) ||
        draftImageData?.url !== publishedImageData?.url;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Top Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/articles"
                            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                <Eye size={20} className="text-blue-600" />
                                <span>Preview Manager</span>
                            </h1>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Comparing Draft vs Published</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isModified && (
                            <PublishArticleButton
                                documentId={draft.documentId}
                                slug={draft.slug}
                                articleTitle={draft.Title}
                            />
                        )}
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Draft Version (New Changes) */}
                    <div className="space-y-8 animate-in slide-in-from-left duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex items-center gap-3 text-2xl font-black text-gray-900 dark:text-white">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <Eye size={24} />
                                </div>
                                <span>Draft Version (Current)</span>
                            </h2>
                            <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-full shadow-lg shadow-blue-200 dark:shadow-none uppercase tracking-widest">Incoming</span>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 sm:p-10 border-2 border-blue-500 shadow-2xl space-y-8">
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">
                                {draft.Title}
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-xl">
                                {draft.Description}
                            </p>

                            {draftImageUrl && (
                                <div className="relative h-64 w-full rounded-3xl overflow-hidden shadow-lg">
                                    <Image src={draftImageUrl} alt="Draft Image" fill className="object-cover" unoptimized />
                                </div>
                            )}

                            <div className="prose prose-blue dark:prose-invert max-w-none">
                                {draft.Content && (
                                    typeof draft.Content === 'string' ? (
                                        <div dangerouslySetInnerHTML={{ __html: draft.Content.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        <BlocksRenderer content={draft.Content} />
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Published Version (Historical Data) */}
                    <div className="space-y-8 animate-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex items-center gap-3 text-2xl font-black text-gray-500 dark:text-gray-400">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl">
                                    <History size={24} />
                                </div>
                                <span>Published Version</span>
                            </h2>
                            <span className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-black rounded-full uppercase tracking-widest">Live</span>
                        </div>

                        {published ? (
                            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 sm:p-10 border border-gray-200 dark:border-gray-700 shadow-xl opacity-75 hover:opacity-100 transition-opacity duration-300 space-y-8">
                                <h3 className="text-4xl font-black text-gray-400 dark:text-gray-600 leading-tight">
                                    {published.Title}
                                </h3>
                                <p className="text-lg text-gray-400 dark:text-gray-600 leading-relaxed italic border-l-4 border-gray-300 dark:border-gray-600 pl-6 py-2">
                                    {published.Description}
                                </p>

                                {publishedImageUrl && (
                                    <div className="relative h-64 w-full rounded-3xl overflow-hidden grayscale opacity-50">
                                        <Image src={publishedImageUrl} alt="Published Image" fill className="object-cover" unoptimized />
                                    </div>
                                )}

                                <div className="prose prose-gray dark:prose-invert max-w-none opacity-50">
                                    {published.Content && (
                                        typeof published.Content === 'string' ? (
                                            <div dangerouslySetInnerHTML={{ __html: published.Content.replace(/\n/g, '<br/>') }} />
                                        ) : (
                                            <BlocksRenderer content={published.Content} />
                                        )
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[500px] bg-gray-100 dark:bg-gray-800/50 rounded-[2.5rem] border-2 border-dashed border-gray-300 dark:border-gray-700 text-center px-10">
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-6 text-gray-400">
                                    <AlertCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Published Version</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                                    This article has never been published. The draft will be the first version to go live.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <footer className="mt-20 py-12 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-center">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Draft & Publish System • Comparison View</p>
            </footer>
        </div>
    );
}
