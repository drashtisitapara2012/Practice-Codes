/**
 * Movies API Client using TMDb (The Movie Database)
 * 
 * Demonstrates Next.js 16 Cache Components with long TTL caching
 * for relatively static content like movie metadata
 */

import { cacheLife, cacheTag } from 'next/cache';
import { TRENDING_MOVIES_TAG, movieTag } from '@/lib/cache/tags';

export interface Movie {
    id: number;
    title: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    voteAverage: number;
    voteCount: number;
    releaseDate: string;
    popularity: number;
    genreIds: number[];
}

export interface MovieDetails extends Movie {
    runtime: number;
    genres: { id: number; name: string }[];
    tagline: string;
    budget: number;
    revenue: number;
    status: string;
    homepage: string | null;
    productionCompanies: { id: number; name: string; logoPath: string | null }[];
}

export interface MovieCredits {
    cast: {
        id: number;
        name: string;
        character: string;
        profilePath: string | null;
        order: number;
    }[];
    crew: {
        id: number;
        name: string;
        job: string;
        department: string;
        profilePath: string | null;
    }[];
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

/**
 * Get trending movies
 * Uses long cache duration as trending list updates slowly
 */
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
    'use cache';
    cacheLife('days'); // Built-in profile: 24 hour cache
    cacheTag(TRENDING_MOVIES_TAG);

    const apiKey = process.env.TMDB_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        return getMockMovies();
    }

    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${apiKey}`
        );
       

        if (!response.ok) {
            console.error(`Movies API error: ${response.status} ${response.statusText}`);
            return getMockMovies();
        }

        const data = await response.json();

        return data.results.map(formatMovie);
    } catch (error) {
        console.error('Movies fetch error:', error);
        return getMockMovies();
    }
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
    'use cache';
    cacheLife('days');
    cacheTag('popular-movies');

    const apiKey = process.env.TMDB_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        return getMockMovies();
    }

    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=${page}`
        );

        if (!response.ok) {
            console.error(`Popular movies API error: ${response.status} ${response.statusText}`);
            return getMockMovies();
        }

        const data = await response.json();
        return data.results.map(formatMovie);
    } catch (error) {
        console.error('Popular movies fetch error:', error);
        return getMockMovies();
    }
}

/**
 * Get movie details by ID
 * Uses maximum cache duration as movie details rarely change
 */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
    'use cache';
    cacheLife('max'); // Built-in profile: maximum cache duration
    cacheTag(movieTag(id));

    const apiKey = process.env.TMDB_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        return getMockMovieDetails(id);
    }

    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}`
        );

        if (!response.ok) {
            console.error(`Movie details API error: ${response.status} ${response.statusText}`);
            return getMockMovieDetails(id);
        }

        const movie = await response.json();

        return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : null,
            backdropPath: movie.backdrop_path ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}` : null,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            releaseDate: movie.release_date,
            popularity: movie.popularity,
            genreIds: movie.genres.map((g: any) => g.id),
            runtime: movie.runtime,
            genres: movie.genres,
            tagline: movie.tagline || '',
            budget: movie.budget,
            revenue: movie.revenue,
            status: movie.status,
            homepage: movie.homepage,
            productionCompanies: movie.production_companies.map((c: any) => ({
                id: c.id,
                name: c.name,
                logoPath: c.logo_path ? `${TMDB_IMAGE_BASE}/w200${c.logo_path}` : null,
            })),
        };
    } catch (error) {
        console.error('Movie details fetch error:', error);
        return getMockMovieDetails(id);
    }
}

/**
 * Get movie credits (cast and crew)
 */
export async function getMovieCredits(id: number): Promise<MovieCredits> {
    'use cache';
    cacheLife('max');
    cacheTag(`movie-credits-${id}`);

    const apiKey = process.env.TMDB_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        return { cast: [], crew: [] };
    }

    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${apiKey}`
    );

    if (!response.ok) {
        throw new Error(`Movie credits fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
        cast: data.cast.slice(0, 10).map((c: any) => ({
            id: c.id,
            name: c.name,
            character: c.character,
            profilePath: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null,
            order: c.order,
        })),
        crew: data.crew.filter((c: any) =>
            ['Director', 'Producer', 'Writer', 'Screenplay'].includes(c.job)
        ).map((c: any) => ({
            id: c.id,
            name: c.name,
            job: c.job,
            department: c.department,
            profilePath: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null,
        })),
    };
}

/**
 * Search movies by query
 */
export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    'use cache';
    cacheLife('hours');
    cacheTag(`movie-search-${query.toLowerCase()}`);

    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        return getMockMovies().filter(m =>
            m.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
        throw new Error(`Movie search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map(formatMovie);
}

// Helper to format API response to Movie type
function formatMovie(movie: any): Movie {
    return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : null,
        backdropPath: movie.backdrop_path ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}` : null,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        releaseDate: movie.release_date,
        popularity: movie.popularity,
        genreIds: movie.genre_ids || [],
    };
}

// Mock data for when API key is not configured
function getMockMovies(): Movie[] {
    return [
        {
            id: 1,
            title: 'The Matrix Resurrections',
            overview: 'Return to a world of two realities: one, everyday life; the other, what lies behind it.',
            posterPath: null,
            backdropPath: null,
            voteAverage: 7.2,
            voteCount: 5000,
            releaseDate: '2021-12-22',
            popularity: 850,
            genreIds: [28, 878],
        },
        {
            id: 2,
            title: 'Inception',
            overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
            posterPath: null,
            backdropPath: null,
            voteAverage: 8.4,
            voteCount: 32000,
            releaseDate: '2010-07-16',
            popularity: 920,
            genreIds: [28, 878, 12],
        },
        {
            id: 3,
            title: 'Interstellar',
            overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            posterPath: null,
            backdropPath: null,
            voteAverage: 8.6,
            voteCount: 28000,
            releaseDate: '2014-11-07',
            popularity: 780,
            genreIds: [12, 18, 878],
        },
    ];
}

function getMockMovieDetails(id: number): MovieDetails {
    return {
        id,
        title: 'Sample Movie',
        overview: 'This is a sample movie description.',
        posterPath: null,
        backdropPath: null,
        voteAverage: 8.0,
        voteCount: 1000,
        releaseDate: '2024-01-01',
        popularity: 100,
        genreIds: [28, 12],
        runtime: 120,
        genres: [
            { id: 28, name: 'Action' },
            { id: 12, name: 'Adventure' },
        ],
        tagline: 'The adventure begins',
        budget: 150000000,
        revenue: 500000000,
        status: 'Released',
        homepage: null,
        productionCompanies: [],
    };
}
