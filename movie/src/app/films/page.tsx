'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    FilmIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import type { Movie } from '@/types/movie';
import { format } from 'date-fns';

const MovieCard = ({
    movie,
    onClick,
}: {
    movie: Movie;
    onClick: () => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={onClick}
    >
        <div className="relative aspect-[2/3] overflow-hidden">
            <img
                src={
                    movie.img ||
                    'https://via.placeholder.com/300x450?text=No+Image'
                }
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                        'https://via.placeholder.com/300x450?text=No+Image';
                }}
            />
        </div>
        <div className="p-6">
            <h3 className="font-bold text-xl mb-3 text-gray-100">
                {movie.title}
            </h3>
            <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                    <FilmIcon className="h-5 w-5 mr-2" />
                    <span>{movie.genre}</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>
                        {movie.releaseDate
                            ? format(new Date(movie.releaseDate), 'dd/MM/yyyy')
                            : 'N/A'}
                    </span>
                </div>
                <p className="text-gray-300 line-clamp-3 mt-3">
                    {movie.description}
                </p>
            </div>
        </div>
    </motion.div>
);

export default function FilmsPage() {
    const { data: session } = useSession();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchMovies = async () => {
            if (!session?.accessToken) return;

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/movies`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMovies(data);
                setFilteredMovies(data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [session?.accessToken]);

    useEffect(() => {
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, movies]);

    if (!session?.accessToken) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-100"></div>
                    <span className="text-gray-100 text-lg">
                        Loading movies...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-100 mb-4">
                        Explore Movies
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Discover our collection of amazing films
                    </p>
                </div>

                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-zinc-800/50 border border-zinc-700/30 rounded-xl 
                                     text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                                     focus:ring-yellow-500/50 focus:border-transparent backdrop-blur-sm"
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredMovies.map((movie) => (
                        <MovieCard
                            key={`movie-${movie.id}`}
                            movie={movie}
                            onClick={() => router.push(`/films/${movie.id}`)}
                        />
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-gray-400 text-lg">
                            No movies found matching "{searchTerm}"
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
