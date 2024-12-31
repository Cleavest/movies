'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
    StarIcon,
    CalendarIcon,
    UserGroupIcon,
    BookmarkIcon as BookmarkOutline,
} from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import type { Movie } from '@/types/movie';
import type { Actor } from '@/types/actor';
import { motion } from 'framer-motion';

interface Review {
    id?: number;
    userId: number;
    username: string;
    filmId: number;
    rating: number;
    review_text: string;
    created_at?: string;
}

const MovieDetailsPage = () => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [actors, setActors] = useState<Actor[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({
        rating: 0,
        review_text: '',
    });
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { data: session } = useSession();
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMovieAndActors = async () => {
            try {
                // Fetch movie details
                const movieResponse = await fetch(
                    `http://localhost:8084/api/movies/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                    }
                );

                if (!movieResponse.ok) {
                    throw new Error('Failed to fetch movie');
                }

                const movieData = await movieResponse.json();
                setMovie(movieData);

                // Fetch actors for this movie
                const actorsResponse = await fetch(
                    `http://localhost:8084/api/movies/${id}/actors`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                    }
                );

                if (!actorsResponse.ok) {
                    throw new Error('Failed to fetch actors');
                }

                const actorsData = await actorsResponse.json();
                setActors(actorsData);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error loading movie details');
            } finally {
                setLoading(false);
            }
        };

        if (session?.accessToken) {
            fetchMovieAndActors();
        }
    }, [id, session?.accessToken]);

    useEffect(() => {
        if (session?.accessToken) {
            // Decode JWT token to get user ID
            const token = session.accessToken as string;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(function (c) {
                        return (
                            '%' +
                            ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join('')
            );
            const payload = JSON.parse(jsonPayload);
            setUserId(Number(payload.sub)); // Convert sub to number
        }
    }, [session?.accessToken]);

    useEffect(() => {
        const checkUserReview = () => {
            const userReview = reviews.find(
                (review) => review.userId === userId
            );
            setHasUserReviewed(!!userReview);
        };

        checkUserReview();
    }, [reviews, userId]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8084/api/reviews/film/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        if (session?.accessToken) {
            fetchReviews();
        }
    }, [id, session?.accessToken]);

    useEffect(() => {
        if (reviews.length > 0) {
            const total = reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            );
            setAverageRating(total / reviews.length);
        } else {
            setAverageRating(0);
        }
    }, [reviews]);

    const handleRatingClick = (rating: number) => {
        setNewReview((prev) => ({ ...prev, rating }));
    };

    const handleSubmitReview = async () => {
        if (!newReview.rating) {
            toast.error('Please select a rating');
            return;
        }

        try {
            const response = await fetch('http://localhost:8084/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                    filmId: Number(id),
                    rating: newReview.rating,
                    review_text: newReview.review_text,
                }),
            });

            if (response.ok) {
                const newReviewData = await response.json();
                setReviews((prev) => [...prev, newReviewData]);
                setNewReview({ rating: 0, review_text: '' });
                toast.success('Review submitted successfully!');
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    const checkWatchlistStatus = async () => {
        if (!session?.accessToken || !id) return;

        try {
            const response = await fetch(
                `http://localhost:8084/api/watchlist/check/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to check watchlist status');
            }

            const isInList = await response.json();
            setIsInWatchlist(isInList);
        } catch (error) {
            console.error('Error checking watchlist status:', error);
        }
    };

    const toggleWatchlist = async () => {
        if (!session?.accessToken || !id) return;
        setIsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8084/api/watchlist/toggle/${id}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to toggle watchlist status');
            }

            const result = await response.json();
            setIsInWatchlist(result.in_watchlist);
            toast.success(result.message);
        } catch (error) {
            console.error('Error toggling watchlist:', error);
            toast.error('Failed to update watchlist');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.accessToken && id) {
            checkWatchlistStatus();
        }
    }, [session?.accessToken, id]);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-100"></div>
                    <span className="text-gray-100 text-lg">
                        Loading movie details...
                    </span>
                </div>
            </div>
        );
    }

    if (!movie) {
        return <div className="container mx-auto p-4">Movie not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Movie Header Section */}
                    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-zinc-700/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
                            {/* Movie Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative aspect-[2/3] group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <img
                                    src={
                                        movie?.img ||
                                        'https://via.placeholder.com/500x750?text=No+Image'
                                    }
                                    alt={movie?.title}
                                    className="w-full h-full object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                                    onError={(e) => {
                                        const target =
                                            e.target as HTMLImageElement;
                                        target.src =
                                            'https://via.placeholder.com/500x750?text=No+Image';
                                    }}
                                />
                            </motion.div>

                            {/* Movie Details */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h1 className="text-5xl font-bold text-gray-100 leading-tight">
                                            {movie?.title}
                                        </h1>
                                        <button
                                            onClick={toggleWatchlist}
                                            disabled={isLoading}
                                            className={`
                                                px-4 py-2 rounded-lg
                                                transition-all duration-300 ease-in-out
                                                ${
                                                    isLoading
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : 'cursor-pointer'
                                                }
                                                ${
                                                    isInWatchlist
                                                        ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                                                        : 'bg-zinc-600 text-white hover:bg-zinc-500'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center space-x-2">
                                                {isInWatchlist ? (
                                                    <BookmarkSolid className="h-5 w-5 transition-transform duration-300" />
                                                ) : (
                                                    <BookmarkOutline className="h-5 w-5 transition-transform duration-300" />
                                                )}
                                                <span className="transition-colors duration-300">
                                                    {isInWatchlist
                                                        ? 'In Watchlist'
                                                        : 'Add to Watchlist'}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <span className="px-4 py-1.5 bg-zinc-700/50 rounded-full text-gray-300 text-sm font-medium backdrop-blur-sm border border-zinc-600/30">
                                            {movie?.genre}
                                        </span>
                                        <span className="px-4 py-1.5 bg-zinc-700/50 rounded-full text-gray-300 text-sm font-medium backdrop-blur-sm border border-zinc-600/30 flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            {movie?.releaseDate
                                                ? new Date(
                                                      movie.releaseDate
                                                  ).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Rating Summary */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-zinc-700/30 backdrop-blur-sm p-6 rounded-2xl border border-zinc-600/30"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="flex flex-col items-center">
                                            <span className="text-5xl font-bold text-gray-100">
                                                {averageRating.toFixed(1)}
                                            </span>
                                            <span className="text-sm text-gray-400 mt-1">
                                                out of 5
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon
                                                        key={star}
                                                        className={`h-7 w-7 ${
                                                            star <=
                                                            Math.round(
                                                                averageRating
                                                            )
                                                                ? 'text-yellow-400'
                                                                : 'text-zinc-600'
                                                        } transition-colors duration-200`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-400">
                                                Based on {reviews.length}{' '}
                                                {reviews.length === 1
                                                    ? 'review'
                                                    : 'reviews'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Cast Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                                        <UserGroupIcon className="h-6 w-6 mr-2" />
                                        Cast
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {actors.map((actor) => (
                                            <span
                                                key={actor.id}
                                                className="px-4 py-2 bg-zinc-700/30 backdrop-blur-sm text-gray-300 rounded-full text-sm border border-zinc-600/30 hover:bg-zinc-600/50 transition-all duration-200 cursor-default"
                                            >
                                                {actor.name}
                                            </span>
                                        ))}
                                        {actors.length === 0 && (
                                            <p className="text-gray-400 italic">
                                                No cast information available
                                            </p>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Description */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="prose prose-invert max-w-none"
                                >
                                    <h2 className="text-xl font-semibold text-gray-100 mb-3">
                                        Description
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed">
                                        {movie?.description}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 bg-zinc-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-zinc-700/30"
                    >
                        <h2 className="text-2xl font-bold text-gray-100 mb-8">
                            Reviews
                        </h2>

                        {/* Add Review Form */}
                        {!hasUserReviewed ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-zinc-700/30 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-zinc-600/30"
                            >
                                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                                    Write a Review
                                </h3>
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
                                                star <= newReview.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-zinc-600 hover:text-zinc-500'
                                            }`}
                                            onClick={() =>
                                                setNewReview((prev) => ({
                                                    ...prev,
                                                    rating: star,
                                                }))
                                            }
                                        />
                                    ))}
                                </div>
                                <textarea
                                    value={newReview.review_text}
                                    onChange={(e) =>
                                        setNewReview((prev) => ({
                                            ...prev,
                                            review_text: e.target.value,
                                        }))
                                    }
                                    placeholder="Share your thoughts about the movie..."
                                    className="w-full p-4 bg-zinc-800/50 backdrop-blur-sm border border-zinc-600/30 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                    rows={4}
                                />
                                <button
                                    onClick={handleSubmitReview}
                                    className="mt-4 px-6 py-3 bg-zinc-600 text-gray-100 rounded-xl hover:bg-zinc-500 transition-all duration-200 transform hover:scale-105"
                                >
                                    Submit Review
                                </button>
                            </motion.div>
                        ) : (
                            <div className="bg-zinc-700/30 backdrop-blur-sm p-4 rounded-xl mb-8 border border-zinc-600/30">
                                <p className="text-gray-300">
                                    You have already submitted a review for this
                                    movie.
                                </p>
                            </div>
                        )}

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {reviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-zinc-700/30 backdrop-blur-sm p-6 rounded-2xl border border-zinc-600/30 hover:bg-zinc-700/40 transition-colors duration-300"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <span className="font-medium text-gray-100">
                                                    {review.username}
                                                    {review.userId ===
                                                        userId && (
                                                        <span className="ml-2 text-xs bg-zinc-600/50 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full border border-zinc-500/30">
                                                            Your Review
                                                        </span>
                                                    )}
                                                </span>
                                                <div className="flex mt-2">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <StarIcon
                                                                key={star}
                                                                className={`h-5 w-5 ${
                                                                    star <=
                                                                    review.rating
                                                                        ? 'text-yellow-400'
                                                                        : 'text-zinc-600'
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-400">
                                            {review.created_at
                                                ? new Date(
                                                      review.created_at
                                                  ).toLocaleDateString()
                                                : ''}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">
                                        {review.review_text}
                                    </p>
                                </motion.div>
                            ))}
                            {reviews.length === 0 && (
                                <p className="text-center text-gray-400 py-8">
                                    No reviews yet. Be the first to review this
                                    movie!
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
