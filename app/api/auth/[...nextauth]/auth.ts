import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { AuthOptions } from 'next-auth';

// Define API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'http://localhost:5000/api';

console.log('Auth Config - API_BASE:', API_BASE);

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 second timeout

// Enhanced API with better error handling
const userAPI = {
  syncOAuth: async (user: any) => {
    console.log(`Attempting to sync OAuth user to ${API_BASE}/auth/sync`, { user });
    try {
      const response = await axios.post(`${API_BASE}/auth/sync`, user);
      console.log('OAuth sync response:', response.data);
      return response;
    } catch (error: any) {
      console.error('API Error in syncOAuth:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        request: !!error.request,
        url: `${API_BASE}/auth/sync`
      });
      
      // If there's a network error, return a structured response
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || !error.response) {
        return {
          data: { 
            error: error.message, 
            isNetworkError: true,
            code: error.code
          },
          status: 500
        };
      }
      
      // For other errors, rethrow to be handled by the caller
      throw error;
    }
  },
  login: async (user: any) => {
    console.log(`Attempting to login user to ${API_BASE}/auth/login`, { email: user.email });
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, user);
      console.log('Login response status:', response.status);
      return response;
    } catch (error: any) {
      console.error('API Error in login:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          console.error('CredentialsProvider: Email and password are required');
          throw new Error('Email and password are required');
        }

        try {
          const res = await userAPI.login({ email: email, password });

          if (!res.data) {
            console.error('CredentialsProvider: Invalid response from server', res);
            throw new Error('Invalid response from server');
          }

          if (res.status === 200 && res.data.user) {
            console.log('CredentialsProvider: Successfully logged in user', res.data.user);
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              name: res.data.user.name,
            };
          }

          console.error('CredentialsProvider: Invalid credentials');
          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('CredentialsProvider error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile, user }) {
      console.log('JWT callback:', { 
        token: { ...token, id: token.id, email: token.email }, 
        account: account ? { provider: account.provider } : null, 
        hasProfile: !!profile,
        hasUser: !!user
      });

      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.id = profile.sub || user?.id;
        token.email = profile.email || user?.email;
      }
      if (user) {
        token.id = user.id || token.id;
        token.email = user.email || token.email;
      }

      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { 
        hasSession: !!session,
        hasToken: !!token
      });

      session.accessToken = token.accessToken as string | undefined;
      session.user.id = token.id as string;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      console.log('SignIn callback started:', { 
        provider: account?.provider, 
        email: profile?.email || credentials?.email,
        hasUser: !!user
      });

      // Google OAuth flow
      if (account?.provider === 'google') {
        console.log('SignIn callback: Google OAuth flow initiated');
        try {
          console.log('SignIn callback: Attempting to sync OAuth user');
          const result = await userAPI.syncOAuth({
            email: profile?.email,
            name: profile?.name,
            providerId: profile?.sub,
            provider: account.provider,
          });

          // Handle network errors in a special way
          if (result.data?.isNetworkError) {
            console.warn('Network error during OAuth sync - continuing authentication anyway', {
              error: result.data.error,
              code: result.data.code
            });
            return true;
          }

          if (result.data?.error) {
            console.error('OAuth sync failed with application error:', result.data.error);
            return false;
          }

          if (result.data?.needsRegistration) {
            console.log('OAuth user needs registration, redirecting to step 2');
            const state = Buffer.from(JSON.stringify({
              email: profile?.email,
              step: 2
            })).toString('base64');
            throw new Error(`Registration required#${state}`);
          }

          console.log('OAuth sync successful');
          return true;
        } catch (error: any) {
          console.error('SignIn callback (Google) Error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
          });
          
          // Custom error for registration flow
          if (error instanceof Error && error.message.startsWith('Registration required#')) {
            throw error;
          }
          
          // Handle network errors and continue authentication
          if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || 
              error.name === 'AxiosError' || error.name === 'NetworkError') {
            console.log('Network error during OAuth sync - continuing authentication');
            return true;
          }
          
          return false;
        }
      } 
      // Credentials flow
      else if (credentials) {
        console.log('SignIn callback: Credentials flow');
        return true;
      }

      console.log('SignIn callback: Unknown provider or flow');
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });

      // Handle custom registration redirect
      if (url.includes('error=Registration%20required%23')) {
        const errorMessage = url.split('error=')[1];
        const state = errorMessage.split('Registration%20required%23')[1];
        const redirectUrl = `${baseUrl}/auth/signin?state=${state}`;
        console.log('Redirecting to registration step:', redirectUrl);
        return redirectUrl;
      }

      // Standard redirects
      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to URL within base URL:', url);
        return url;
      }
      if (url.startsWith('/')) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log('Redirecting to relative URL:', redirectUrl);
        return redirectUrl;
      }

      // Default redirect
      const defaultRedirect = `${baseUrl}/training`;
      console.log('Default redirect to:', defaultRedirect);
      return defaultRedirect;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // Add a custom error page
  },
  events: {
    async createUser({ user }) {
      console.log('User created event:', { id: user.id, email: user.email });
    },
    async signIn({ user, account, profile, isNewUser }) {
      console.log('Sign-in event:', { 
        email: user.email, 
        provider: account?.provider,
        isNewUser
      });
    }
  },
  debug: true, // Enable debug mode to see more detailed errors
};