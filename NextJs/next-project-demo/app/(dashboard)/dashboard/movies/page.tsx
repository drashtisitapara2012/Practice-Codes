
import { Suspense } from 'react';
import { getTrendingMovies, getPopularMovies, type Movie } from '@/lib/api/movies';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Film, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import TrendingGrid from '@/components/dashboard/TrendingGrid';

export const metadata = {
    title: 'Movies | NextHub',
    description: 'Explore trending and popular movies',
};

export default async function MoviesPage() {
    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Movie Explorer</h1>
                <p className="text-muted-foreground">Discover what's trending and popular in cinema right now.</p>
            </div>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PlayCircle className="size-6 text-purple-500" />
                        Recently Trending
                    </h2>
                </div>
                <Suspense fallback={<MovieGridSkeleton />}>
                    <TrendingGrid />
                </Suspense>
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Star className="size-6 text-yellow-500" />
                        All-Time Popular
                    </h2>
                </div>
                <Suspense fallback={<MovieGridSkeleton />}>
                    <PopularGrid />
                </Suspense>
            </section>
        </div>
    );
}

// async function TrendingGrid() {
//     const movies = await getTrendingMovies('day');
//     return <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//         {movies.slice(0, 10).map((movie) => <MovieItem key={movie.id} movie={movie} />)}
//     </div>;
// }



async function PopularGrid() {
    const movies = await getPopularMovies();
    return <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.slice(0, 10).map((movie) => <MovieItem key={movie.id} movie={movie} />)}
    </div>;
}

function MovieItem({ movie }: { movie: Movie }) {
    return (
        <Link href={`/dashboard/movies/${movie.id}`} className="group space-y-3">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border bg-muted shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/30">
                {movie.posterPath ? (
                    <Image
                        src={movie.posterPath}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 20vw"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground bg-muted/50">
                        <Film className="size-10 mb-2 opacity-20" />
                        <span className="text-xs px-4 text-center">No Poster</span>
                    </div>
                )}

                <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 backdrop-blur-md text-white border-none text-[10px] h-5">
                        <Star className="size-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.voteAverage.toFixed(1)}
                    </Badge>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="font-bold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Calendar className="size-3" />
                    {movie.releaseDate?.split('-')[0] || 'TBA'}
                </div>
            </div>
        </Link>
    );
}

function MovieGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                    <div className="aspect-[2/3] w-full bg-muted animate-pulse rounded-xl" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-muted animate-pulse rounded" />
                        <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
