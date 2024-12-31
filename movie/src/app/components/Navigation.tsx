'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FilmIcon,
    HomeIcon,
    UserCircleIcon,
    BookmarkIcon,
} from '@heroicons/react/24/outline';

export default function Navigation() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-zinc-900 border-b border-zinc-800 shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 text-xl font-bold text-gray-100 hover:text-gray-300 transition-colors"
                        >
                            <FilmIcon className="h-8 w-8" />
                            <span>MovieApp</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* <Link
                            href="/"
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                                pathname === '/'
                                    ? 'bg-zinc-700 text-gray-100'
                                    : 'text-gray-300 hover:bg-zinc-800 hover:text-gray-100'
                            } transition-all duration-200 ease-in-out`}
                        >
                            <HomeIcon className="h-5 w-5" />
                            <span>Αρχική</span>
                        </Link> */}

                        {status === 'authenticated' ? (
                            <>
                                <Link
                                    href="/films"
                                    className="flex items-center space-x-1 px-3 py-2 rounded-md bg-zinc-700 text-gray-100 hover:bg-zinc-600 transition-all duration-200 ease-in-out"
                                >
                                    <FilmIcon className="h-5 w-5" />
                                    <span>Movies</span>
                                </Link>
                                {/* <Link
                                    href="/dashboard"
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                                        pathname === '/dashboard'
                                            ? 'bg-zinc-700 text-gray-100'
                                            : 'text-gray-300 hover:bg-zinc-800 hover:text-gray-100'
                                    } transition-all duration-200 ease-in-out`}
                                >
                                    <UserCircleIcon className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link> */}
                                <Link
                                    href="/watchlist"
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                                        pathname === '/watchlist'
                                            ? 'bg-zinc-700 text-gray-100'
                                            : 'text-gray-300 hover:bg-zinc-800 hover:text-gray-100'
                                    } transition-all duration-200 ease-in-out`}
                                >
                                    <BookmarkIcon className="h-5 w-5" />
                                    <span>Watchlist</span>
                                </Link>
                                <div className="flex items-center space-x-4 pl-4 border-l border-zinc-700">
                                    <span className="text-gray-300 font-medium">
                                        {session.user?.name}
                                    </span>
                                    <button
                                        onClick={() =>
                                            signOut({ callbackUrl: '/' })
                                        }
                                        className="px-4 py-2 text-sm font-medium text-gray-100 bg-zinc-700 rounded-md hover:bg-zinc-600 transform hover:scale-105 transition-all duration-200 ease-in-out"
                                    >
                                        Αποσύνδεση
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 text-sm font-medium ${
                                        pathname === '/login'
                                            ? 'bg-zinc-700 text-gray-100'
                                            : 'text-gray-300 hover:bg-zinc-800 hover:text-gray-100'
                                    } rounded-md transform hover:scale-105 transition-all duration-200 ease-in-out`}
                                >
                                    Σύνδεση
                                </Link>
                                <Link
                                    href="/register"
                                    className={`px-4 py-2 text-sm font-medium ${
                                        pathname === '/register'
                                            ? 'bg-zinc-700 text-gray-100'
                                            : 'text-gray-300 hover:bg-zinc-800 hover:text-gray-100'
                                    } rounded-md transform hover:scale-105 transition-all duration-200 ease-in-out`}
                                >
                                    Εγγραφή
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
