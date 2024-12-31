import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/login',
    },
});

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/films/:path*',
        '/watchlist',
        // Προσθέστε εδώ όποια άλλα protected routes θέλετε
    ],
};
