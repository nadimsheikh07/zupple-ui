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

                    const userData = response.data;

                    // Assuming your API returns user data with an id
                    if (userData && userData.id) {
                        return {
                            id: userData._id.toString(), // Ensure id is string
                            email: userData.email,
                            name: userData.name,
                            // Include any tokens or additional data from your API
                            accessToken: userData.accessToken,
                            refreshToken: userData.refreshToken,
                            ...userData
                        };
                    }

                    // Return null if user data could not be retrieved
                    return null;
                } catch (error: any) {
                    console.error('Authorization error:', error);

                    // Handle different error scenarios
                    if (error.response?.status === 401) {
                        throw new Error('Invalid email or password');
                    } else if (error.response?.status === 404) {
                        throw new Error('User not found');
                    } else if (error.response?.data?.message) {
                        throw new Error(error.response.data.message);
                    } else if (error.request) {
                        throw new Error('Network error. Please try again.');
                    } else {
                        throw new Error('Login failed. Please try again.');
                    }
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
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user && account) {
                return {
                    ...token,
                    id: user.id,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    // Include any other user data you need
                    ...user
                };
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }

            // Add tokens to session if needed
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.error = token.error as string;

            return session;
        },
    },
    events: {
        async signOut(message) {
            // Optional: Call your API logout endpoint when user signs out
            try {
                await authAxiosInstance.post('/auth/sign-out');
            } catch (error) {
                console.error('Logout error:', error);
            }
        },
    },
};