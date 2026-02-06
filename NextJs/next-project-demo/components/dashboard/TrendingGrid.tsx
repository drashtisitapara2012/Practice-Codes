"use client";

import { useEffect, useState } from 'react';
import { MovieItem } from '@/components/dashboard/movie-item';


export default function TrendingGrid() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovies() {
            console.log('Fetching movies from API...');

            const res = await fetch('/api/movies?window=day');
            const data = await res.json();
            setMovies(data);
            setLoading(false);
        }

        fetchMovies();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.slice(0, 10).map((movie) => (
                <MovieItem key={movie.id} movie={movie} />
            ))}
        </div>
    );
}

