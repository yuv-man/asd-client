import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userAPI } from '@/lib/api';
import { AuthOptions } from 'next-auth';

// ✅ TEMP DEBUG: Log env variables
console.log('ENV CHECK: ', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  });

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
      console.log('JWT callback:', { token, account, profile, user });

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
      console.log('Session callback:', { session, token });

      session.accessToken = token.accessToken as string | undefined;
      session.user.id = token.id as string;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      console.log('SignIn callback:', { account, profile, user, credentials });

      if (account?.provider === 'google') {
        console.log('SignIn callback: Google OAuth flow initiated');
        try {
          const res = await userAPI.syncOAuth({
            email: profile?.email,
            name: profile?.name,
            providerId: profile?.sub,
            provider: account.provider,
          });

          console.log('SignIn callback (Google): syncOAuth response:', res);

          if (res.data?.needsRegistration) {
            const state = Buffer.from(JSON.stringify({
              email: profile?.email,
              step: 2
            })).toString('base64');

            console.log('SignIn callback (Google): Registration required, throwing error');
            throw new Error(`Registration required#${state}`);
          }

          console.log('SignIn callback (Google): Sign-in successful');
          return true;
        } catch (error) {
          console.error('SignIn callback (Google) Error:', error);
          if (error instanceof Error && error.message.startsWith('Registration required#')) {
            console.log('SignIn callback (Google): Propagating registration required error');
            throw error;
          }
          console.log('SignIn callback (Google): Sign-in failed');
          return false; // Block sign in for other errors
        }
      } else if (credentials) {
        // Email/Password Sign-in - logs are within the authorize function
        console.log('SignIn callback: Credentials flow');
        return true;
      }

      console.log('SignIn callback: Unknown provider or flow');
      return true; // Should not reach here usually
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });

      if (url.includes('error=Registration%20required%23')) {
        const errorMessage = url.split('error=')[1];
        const state = errorMessage.split('Registration%20required%23')[1];
        return `${baseUrl}/auth/signin?state=${state}`;
      }

      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;

      return `${baseUrl}/training`;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async createUser({ user }) {
      console.log('User created:', user);
    },
    async signIn({ user, account, profile, isNewUser }) {
      console.log('Sign-in event:', { user, account, profile, isNewUser });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};