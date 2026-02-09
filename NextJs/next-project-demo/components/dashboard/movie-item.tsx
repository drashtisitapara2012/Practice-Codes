import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Film } from 'lucide-react';
import type { Movie } from '@/lib/api/movies';

export function MovieItem({ movie }: { movie: Movie }) {
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
