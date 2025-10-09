import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import authAxiosInstance from './utils/authAxiosInstance';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                try {
                    const response = await authAxiosInstance.post('/auth/sign-in', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const user = response.data;

                    if (user && user._id) {
                        return {
                            id: user._id,
                            email: user.email,
                            name: user.name,
                            // Include any other user properties you need
                            ...user
                        };
                    }

                    return null;
                } catch (error: any) {
                    if (error.response?.data?.message) {
                        throw new Error(error.response.data.message);
                    }
                    throw new Error('Login failed. Please try again.');
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // Add any other user properties you want to include in the token
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                // Add any other token properties you want to include in the session
            }
            return session;
        },
    },
};