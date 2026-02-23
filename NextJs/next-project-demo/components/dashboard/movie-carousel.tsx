import { getTrendingMovies, type Movie } from '@/lib/api/movies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Film, Star, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MovieCarouselProps {
    limit?: number;
}

/**
 * Movie Carousel - Server Component with "use cache"
 * 
 * This component demonstrates:
 * - Server Components (async data fetching)
 * - Next.js 16 Cache Components with long TTL (via getTrendingMovies)
 * - ISR-like behavior with cacheLife('days')
 */
export async function MovieCarousel({ limit = 6 }: MovieCarouselProps) {
    const movies = await getTrendingMovies();
    const displayMovies = movies.slice(0, limit);

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Film className="size-5 text-purple-500" />
                        Trending Movies
                    </CardTitle>
                    <Link
                        href="/dashboard/movies"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        View all
                        <ArrowRight className="size-3" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {displayMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function MovieCard({ movie }: { movie: Movie }) {
    return (
        <Link
            href={`/dashboard/movies/${movie.id}`}
            className="group"
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                {movie.posterPath ? (
                    <Image
                        src={movie.posterPath}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Film className="size-8 text-muted-foreground" />
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Rating badge */}
                <div className="absolute top-2 right-2">
                    <Badge className="bg-black/60 backdrop-blur-sm">
                        <Star className="size-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.voteAverage.toFixed(1)}
                    </Badge>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="font-medium text-white text-sm line-clamp-1">
                        {movie.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-white/70 mt-1">
                        <Calendar className="size-3" />
                        {movie.releaseDate?.split('-')[0] || 'TBA'}
                    </div>
                </div>
            </div>

            {/* Title below poster (visible on tablet+) */}
            <h3 className="mt-2 font-medium text-sm line-clamp-1 hidden sm:block">
                {movie.title}
            </h3>
        </Link>
    );
}

/**
 * Featured Movie - For hero sections
 */
export async function FeaturedMovie() {
    const movies = await getTrendingMovies();
    const featured = movies[0];

    if (!featured) return null;

    return (
        <Link
            href={`/dashboard/movies/${featured.id}`}
            className="group relative block overflow-hidden rounded-xl"
        >
            <div className="relative aspect-[21/9]">
                {featured.backdropPath ? (
                    <Image
                        src={featured.backdropPath}
                        alt={featured.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                        <Film className="size-16 text-muted-foreground" />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="p-6 md:p-10 max-w-2xl">
                        <Badge variant="secondary" className="mb-4">
                            🔥 Trending Now
                        </Badge>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                            {featured.title}
                        </h2>
                        <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4">
                            {featured.overview}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                            <span className="flex items-center gap-1">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                {featured.voteAverage.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                {featured.releaseDate?.split('-')[0]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
