'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { BookmarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import type { Movie } from '@/types/movie';

export default function WatchlistPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8084/api/watchlist',
                    {
                        headers: {
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch watchlist');
                }

                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error loading watchlist');
            } finally {
                setLoading(false);
            }
        };

        if (session?.accessToken) {
            fetchWatchlist();
        }
    }, [session?.accessToken]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-100"></div>
                    <span className="text-gray-100 text-lg">
                        Loading watchlist...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800 py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex items-center space-x-3 mb-8">
                        <BookmarkIcon className="h-8 w-8 text-yellow-400" />
                        <h1 className="text-4xl font-bold text-gray-100">
                            My Watchlist
                        </h1>
                    </div>

                    {movies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {movies.map((movie) => (
                                <motion.div
                                    key={`movie-${movie.id}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-zinc-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-zinc-700/30 cursor-pointer"
                                    onClick={() =>
                                        router.push(`/films/${movie.id}`)
                                    }
                                >
                                    <div className="relative aspect-[2/3]">
                                        <img
                                            src={
                                                movie.img ||
                                                'https://via.placeholder.com/300x450?text=No+Image'
                                            }
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.src =
                                                    'https://via.placeholder.com/300x450?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-100 mb-2">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            <span>
                                                {movie.releaseDate
                                                    ? new Date(
                                                          movie.releaseDate
                                                      ).getFullYear()
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <p className="text-gray-400 text-lg">
                                Your watchlist is empty. Start adding movies you
                                want to watch!
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
