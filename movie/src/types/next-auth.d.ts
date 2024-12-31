import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        error?: string;
        user: {
            id: string;
            username: string;
            name: string;
        };
    }

    interface User {
        id: string;
        username: string;
        accessToken: string;
        expiresAt: string;
        issuedAt: string;
    }

    interface JWT {
        id: string;
        accessToken: string;
        expiresAt: string;
        issuedAt: string;
        error?: string;
    }
}
