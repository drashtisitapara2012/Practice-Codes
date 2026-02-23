import { Suspense } from 'react';
import { getNews, type NewsCategory } from '@/lib/api/news';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, Clock, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { PageLoadingSkeleton } from '@/components/shared/loading-skeleton';

export const metadata = {
    title: 'News | NextHub',
    description: 'Top headlines and breaking news',
};

interface NewsPageProps {
    searchParams: Promise<{ category?: string }>;
}

/**
 * News Page
 * 
 * Uses nested Suspense to avoid blocking the initial shell.
 * searchParams access must be within a Suspense boundary in Next.js 16.
 */
export default function NewsPage({ searchParams }: NewsPageProps) {
    return (
        <Suspense fallback={<PageLoadingSkeleton />}>
            <NewsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function NewsContent({ searchParams }: NewsPageProps) {
    const params = await searchParams;
    const currentCategory = (params.category || 'technology') as NewsCategory;

    const categories: { label: string; value: NewsCategory }[] = [
        { label: 'Top', value: 'top' },
        { label: 'Technology', value: 'technology' },
        { label: 'Business', value: 'business' },
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'Sports', value: 'sports' },
        { label: 'Science', value: 'science' },
        { label: 'Health', value: 'health' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Global News Feed</h1>
                    <p className="text-muted-foreground">Stay informed with the latest updates from around the world.</p>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {categories.map((cat) => (
                    <Link key={cat.value} href={`/dashboard/news?category=${cat.value}`}>
                        <Button
                            variant={currentCategory === cat.value ? 'default' : 'outline'}
                            size="sm"
                            className="rounded-full whitespace-nowrap"
                        >
                            {cat.label}
                        </Button>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6">
                <Suspense key={currentCategory} fallback={<NewsGridSkeleton />}>
                    <NewsGrid category={currentCategory} />
                </Suspense>
            </div>
        </div>
    );
}

async function NewsGrid({ category }: { category: NewsCategory }) {
    const articles = await getNews(category, 20);

    if (articles.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Newspaper className="size-12 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-xl font-medium">No articles found</h3>
                    <p className="text-muted-foreground">Try a different category or check back later.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
                <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20 overflow-hidden"
                >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {article.imageUrl ? (
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Newspaper className="size-10 text-muted-foreground/30" />
                            </div>
                        )}
                        <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                {article.source}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Clock className="size-3" />
                            {formatRelativeTime(article.publishedAt)}
                        </div>

                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                            {article.description || 'Click to read the full story on the original source.'}
                        </p>

                        <div className="flex items-center text-sm font-medium text-primary mt-auto">
                            Read Story <ChevronRight className="size-4 ml-1" />
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}

function NewsGridSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <div className="aspect-video w-full bg-muted animate-pulse" />
                    <CardContent className="p-5 space-y-4">
                        <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                        <div className="space-y-2">
                            <div className="h-5 w-full bg-muted animate-pulse rounded" />
                            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-muted animate-pulse rounded" />
                            <div className="h-3 w-full bg-muted animate-pulse rounded" />
                            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
