'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Welcome back, {session?.user?.email}
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Existing Stats Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Your Stats</h2>
                    <p className="text-gray-600">
                        Here you can see your activity statistics
                    </p>
                </div>

                {/* New Movies Card with Link */}
                <Link
                    href="/films"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <svg
                            className="w-12 h-12 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 4v16M17 4v16M3 8h18M3 16h18"
                            />
                        </svg>
                        <h2 className="text-xl font-semibold text-center">
                            Browse Movies
                        </h2>
                        <p className="text-gray-600 text-center">
                            Explore our collection of movies
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
