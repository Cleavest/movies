'use client';

import { SessionProvider } from 'next-auth/react';
import ScrollToTop from '@/app/components/ScrollToTop';
import Navbar from '@/app/components/Navigation';
import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <ScrollToTop />
                    <Navbar />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
