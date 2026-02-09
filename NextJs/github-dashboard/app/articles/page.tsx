import { getArticles, getStrapiMedia } from '@/app/lib/api/strapi';
import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';
import { BookOpen, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: 'Articles | GitHub Dashboard',
    description: 'Read the latest updates and articles from our dashboard',
};

export default async function ArticlesPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-12">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold hover:scale-105 transition-all text-sm"
                            >
                                ← Dashboard
                            </Link>
                            <Link
                                href="/articles/create"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold hover:scale-105 transition-all flex items-center gap-2 text-sm"
                            >
                                <span>Create New Post</span>
                            </Link>
                        </div>
                        <ThemeToggle />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Latest Articles
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore curated content and technical insights directly from our Strapi CMS.
                    </p>
                </header>

                <main className="max-w-6xl mx-auto">
                    {articles.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
                            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-xl font-medium text-gray-500">No articles found in Strapi yet.</p>
                            <p className="text-gray-400 mt-2 mb-8">Publish some content in your Strapi dashboard or create one here.</p>
                            <Link
                                href="/articles/create"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 hover:scale-105 transition-all"
                            >
                                Create Your First Post
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
                                                    <ImageIcon size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                                                {article.Title}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                                                {article.Description || "No description available."}
                                            </p>
                                            <div className="mt-auto">
                                                <Link
                                                    href={`/articles/${article.slug}`}
                                                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all"
                                                >
                                                    <span>Read More</span>
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
