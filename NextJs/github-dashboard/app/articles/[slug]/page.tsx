import { getArticleBySlug, getStrapiMedia } from '@/app/lib/api/strapi';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ThemeToggle from '@/app/components/ThemeToggle';
import { ChevronLeft, Calendar, Edit3 } from 'lucide-react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import DeleteArticleButton from '@/app/components/DeleteArticleButton';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const imageData = (article.Cover as any)?.data || article.Cover || (article.Image as any)?.data || article.Image;
    const imageUrl = getStrapiMedia(imageData?.url);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
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

                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-1.5 px-3 gap-2">
                                    <Link
                                        href={`/articles/edit/${article.slug}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                        title="Edit post"
                                    >
                                        <Edit3 size={20} />
                                    </Link>
                                    <div className="w-px h-6 bg-gray-100 dark:bg-gray-700 mx-1" />
                                    <DeleteArticleButton documentId={article.documentId} articleTitle={article.Title} />
                                </div>
                                <ThemeToggle />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs uppercase tracking-widest font-black">Technical Insight</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <Calendar size={14} />
                                        <span>{new Date(article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Mobile Admin Actions */}
                                <div className="flex sm:hidden items-center gap-2">
                                    <Link href={`/articles/edit/${article.slug}`} className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-blue-600">
                                        <Edit3 size={18} />
                                    </Link>
                                    <DeleteArticleButton documentId={article.documentId} articleTitle={article.Title} />
                                </div>
                            </div>

                            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                                {article.Title}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2">
                                {article.Description}
                            </p>
                        </div>
                    </header>

                    {imageUrl && (
                        <div className="relative h-[400px] w-full mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                            <Image
                                src={imageUrl}
                                alt={article.Title}
                                fill
                                unoptimized
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <main className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden">
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-loose">
                            {article.Content && (
                                typeof article.Content === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: article.Content.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <BlocksRenderer content={article.Content} />
                                )
                            )}
                        </div>
                    </main>

                    <footer className="mt-16 text-center">
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mb-8" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">© 2024 GitHub Dashboard Content Team</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
