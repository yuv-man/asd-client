import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userAPI } from '@/lib/api';
import { AuthOptions, Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    }
    accessToken?: string;
  }
}


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
      maxAge: 30 * 24 * 60 * 60, // 30 days
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
        session.user.provider = token.provider as string | undefined;
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
  
        // Add specific redirect for signup flow from login component
        if (url.startsWith(`${baseUrl}/signup`)) {
          console.log('Redirecting to signup page:', url);
          return url;
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
  
        // Default redirect - let middleware handle this
        return baseUrl;
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
      // Update this to your login page path
      newUser: '/signup', // Redirect new OAuth users to signup
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
    debug: process.env.NODE_ENV === 'development', // Only enable debug mode in development
  };