import { Suspense } from 'react';
import { getMovieDetails, getMovieCredits, type MovieDetails as MovieDetailsType } from '@/lib/api/movies';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Star,
    Calendar,
    Clock,
    Globe,
    ArrowLeft,
    Bookmark,
    Share2,
    Play,
    Film
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BookmarkButton } from '@/components/dashboard/bookmark-button';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const movie = await getMovieDetails(parseInt(id));
        return {
            title: `${movie.title} | NextHub`,
            description: movie.overview,
            openGraph: {
                images: movie.backdropPath ? [movie.backdropPath] : [],
            },
        };
    } catch {
        return { title: 'Movie Not Found' };
    }
}

export default async function MovieDetailPage({ params }: Props) {
    const { id } = await params;
    const movieId = parseInt(id);

    if (isNaN(movieId)) notFound();

    return (
        <div className="space-y-8 pb-12">
            <Link
                href="/dashboard/movies"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="mr-2 size-4" />
                Back to Movies
            </Link>

            <Suspense fallback={<MovieDetailSkeleton />}>
                <MovieDetails id={movieId} />
            </Suspense>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Overiew</h2>
                        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
                            <Overview id={movieId} />
                        </Suspense>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Cast</h2>
                        <Suspense fallback={<div className="flex gap-4 overflow-hidden"><Skeleton className="h-24 w-16" /></div>}>
                            <CastList id={movieId} />
                        </Suspense>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Details</h2>
                        <Suspense fallback={<Skeleton className="h-60 w-full" />}>
                            <SidePanel id={movieId} />
                        </Suspense>
                    </section>
                </div>
            </div>
        </div>
    );
}

async function MovieDetails({ id }: { id: number }) {
    const movie = await getMovieDetails(id);

    return (
        <div className="relative w-full rounded-2xl overflow-hidden border bg-muted">
            <div className="absolute inset-0 z-0">
                {movie.backdropPath && (
                    <Image
                        src={movie.backdropPath}
                        alt={movie.title}
                        fill
                        className="object-cover opacity-30 blur-[2px]"
                        priority
                        unoptimized
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative aspect-[2/3] w-full md:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border bg-card">
                    {movie.posterPath ? (
                        <Image
                            src={movie.posterPath}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Film className="size-12 text-muted-foreground/30" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((g) => (
                                <Badge key={g.id} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    {g.name}
                                </Badge>
                            ))}
                            <Badge variant="outline">{movie.status}</Badge>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{movie.title}</h1>
                        {movie.tagline && <p className="text-xl text-muted-foreground font-medium italic">&quot;{movie.tagline}&quot;</p>}
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <Star className="size-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xl">{movie.voteAverage.toFixed(1)}</span>
                            <span className="text-muted-foreground">/ 10</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-muted-foreground" />
                            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button className="gap-2" size="lg">
                            <Play className="size-4 fill-current" /> Play Trailer
                        </Button>
                        <BookmarkButton
                            type="movie"
                            id={movie.id.toString()}
                            title={movie.title}
                            thumbnail={movie.posterPath || undefined}
                        />
                        <Button variant="outline" size="icon">
                            <Share2 className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function Overview({ id }: { id: number }) {
    const movie = await getMovieDetails(id);
    return <p className="text-lg text-muted-foreground leading-relaxed">{movie.overview}</p>;
}

async function CastList({ id }: { id: number }) {
    const credits = await getMovieCredits(id);

    if (credits.cast.length === 0) return <p className="text-muted-foreground">Cast information not available.</p>;

    return (
        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
            {credits.cast.map((person) => (
                <div key={person.id} className="flex-none w-32 space-y-2 text-center group">
                    <div className="relative h-40 rounded-xl overflow-hidden border bg-muted">
                        {person.profilePath ? (
                            <Image
                                src={person.profilePath}
                                alt={person.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground/30">
                                <Film className="size-8" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold truncate">{person.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

async function SidePanel({ id }: { id: number }) {
    const movie = await getMovieDetails(id);

    const stats = [
        { label: 'Budget', value: movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A' },
        { label: 'Revenue', value: movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : 'N/A' },
        { label: 'Original Language', value: movie.status },
        { label: 'Status', value: movie.status },
    ];

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className="font-bold">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {movie.homepage && (
                    <Button variant="outline" className="w-full gap-2" asChild>
                        <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                            <Globe className="size-4" /> Official Website
                        </a>
                    </Button>
                )}

                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Production</h4>
                    <div className="flex flex-wrap gap-2">
                        {movie.productionCompanies.map((c) => (
                            <Badge key={c.id} variant="outline" className="text-[10px]">
                                {c.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function MovieDetailSkeleton() {
    return (
        <div className="h-[400px] w-full bg-muted animate-pulse rounded-2xl" />
    );
}
