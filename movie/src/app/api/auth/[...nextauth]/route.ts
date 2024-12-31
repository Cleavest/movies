import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const loginRes = await fetch(
                        `${process.env.NEXT_INTERNAL_API_URL}/api/auth/login`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                username: credentials?.username,
                                password: credentials?.password,
                            }),
                        }
                    );

                    const loginData = await loginRes.json();
                    if (!loginRes.ok || !loginData.token) {
                        return null;
                    }

                    const userRes = await fetch(
                        `${process.env.NEXT_INTERNAL_API_URL}/api/auth/me`,
                        {
                            headers: {
                                Authorization: `Bearer ${loginData.token}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    const userData = await userRes.json();
                    return {
                        id: userData.id.toString(),
                        name: userData.username,
                        email: userData.email,
                        accessToken: loginData.token,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session) {
                session.accessToken = token.accessToken;
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
});

export { handler as GET, handler as POST };
