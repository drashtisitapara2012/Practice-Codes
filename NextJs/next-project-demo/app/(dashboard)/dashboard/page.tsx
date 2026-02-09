import { Suspense } from 'react';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { NewsFeed } from '@/components/dashboard/news-feed';
import { MovieCarousel } from '@/components/dashboard/movie-carousel';
import { RecipeGrid } from '@/components/dashboard/recipe-grid';
import { LoadingSkeleton, PageLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { auth } from '@/lib/auth';
import { getPreferences } from '@/app/actions/preferences';

export default function DashboardPage() {
    return (
        <Suspense fallback={<PageLoadingSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}

async function DashboardContent() {
    const session = await auth();
    const preferences = await getPreferences();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {session?.user?.name || 'Guest'}
                </h1>
                <p className="text-muted-foreground">
                    Here is your personalized dashboard overview.
                </p>
            </div>

            {/* Weather Section - SSR with Suspense */}
            <section>
                <Suspense fallback={<LoadingSkeleton type="weather" />}>
                    <div className="max-w-md">
                        <WeatherCard city={preferences.defaultCity} />
                    </div>
                </Suspense>
            </section>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* News Feed - SSR with Suspense */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight">Latest News</h2>
                    </div>
                    <Suspense fallback={<LoadingSkeleton type="news" />}>
                        <NewsFeed category={preferences.newsCategory as any} />
                    </Suspense>
                </section>

                {/* Trending Movies - SSR with Suspense */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight">Trending Movies</h2>
                    </div>
                    <Suspense fallback={<LoadingSkeleton type="movies" />}>
                        <MovieCarousel limit={4} />
                    </Suspense>
                </section>
            </div>

            {/* Recipes - SSR with Suspense */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Recipe Inspiration</h2>
                </div>
                <Suspense fallback={<LoadingSkeleton type="recipe" />}>
                    <RecipeGrid count={3} />
                </Suspense>
            </section>
        </div>
    );
}
