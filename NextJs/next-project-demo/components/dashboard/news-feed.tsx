import { getNews, type NewsArticle, type NewsCategory } from '@/lib/api/news';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { formatRelativeTime, truncate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface NewsFeedProps {
    category?: NewsCategory;
    limit?: number;
}

/**
 * News Feed - Server Component with "use cache"
 * 
 * This component demonstrates:
 * - Server Components (async data fetching)
 * - Next.js 16 Cache Components with short TTL (via getNews)
 * - Streaming SSR (works with Suspense)
 */
export async function NewsFeed({ category = 'technology', limit = 5 }: NewsFeedProps) {
    const articles = await getNews(category, limit);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <Newspaper className="size-5 text-emerald-500" />
                    {category.charAt(0).toUpperCase() + category.slice(1)} News
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {articles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No articles available</p>
                    ) : (
                        articles.map((article) => (
                            <NewsArticleItem key={article.id} article={article} />
                        ))
                    )}
                </div>

                <Link
                    href={`/dashboard/news?category=${category}`}
                    className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
                >
                    View all news
                    <ExternalLink className="ml-1 size-3" />
                </Link>
            </CardContent>
        </Card>
    );
}

function NewsArticleItem({ article }: { article: NewsArticle }) {
    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-accent"
        >
            {/* Thumbnail */}
            {article.imageUrl && (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        unoptimized
                    />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                </h4>

                {article.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {truncate(article.description, 100)}
                    </p>
                )}

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {article.source}
                    </Badge>
                    <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatRelativeTime(article.publishedAt)}
                    </span>
                </div>
            </div>
        </a>
    );
}
