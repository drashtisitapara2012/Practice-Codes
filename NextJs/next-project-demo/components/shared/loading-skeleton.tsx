import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type SkeletonType = 'weather' | 'news' | 'movies' | 'recipe' | 'card' | 'list';

interface LoadingSkeletonProps {
    type?: SkeletonType;
}

/**
 * Loading Skeleton Component
 * 
 * Provides consistent loading states for Suspense boundaries
 * Used with Streaming SSR to show placeholders while data loads
 */
export function LoadingSkeleton({ type = 'card' }: LoadingSkeletonProps) {
    switch (type) {
        case 'weather':
            return <WeatherSkeleton />;
        case 'news':
            return <NewsSkeleton />;
        case 'movies':
            return <MoviesSkeleton />;
        case 'recipe':
            return <RecipeSkeleton />;
        case 'list':
            return <ListSkeleton />;
        default:
            return <CardSkeleton />;
    }
}

function WeatherSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-5 rounded" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <Skeleton className="size-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

function NewsSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-5 rounded" />
                    <Skeleton className="h-5 w-36" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <Skeleton className="size-16 shrink-0 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-16 rounded-full" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function MoviesSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-5 rounded" />
                        <Skeleton className="h-5 w-36" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="aspect-[2/3] rounded-lg" />
                            <Skeleton className="mt-2 h-4 w-full hidden sm:block" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function RecipeSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-5 rounded" />
                        <Skeleton className="h-5 w-36" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function ListSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function CardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Full Page Loading
 */
export function PageLoadingSkeleton() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
}
