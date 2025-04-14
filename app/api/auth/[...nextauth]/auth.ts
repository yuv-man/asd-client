import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userAPI } from '@/lib/api';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
        }
      }
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
          throw new Error('Email and password are required');
        }

        try {
          const res = await userAPI.login({ email: email, password });
          
          if (!res.data) {
            throw new Error('Invalid response from server');
          }

          if (res.status === 200 && res.data.user) {
            // Make sure we return a properly structured user object
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              name: res.data.user.name,
              // Add any other required user properties
            };
          }
          
          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('CredentialsProvider error:', error);
          throw error; // Throw the error instead of returning null
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
      
      // Add more details to the token
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.id = profile.sub || user?.id;
        token.email = profile.email || user?.email;
      }
      if (user) {
        // Make sure user data is properly added to the token
        token.id = user.id || token.id;
        token.email = user.email || token.email;
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken as string | undefined;
      session.user.id = token.id as string; 
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      console.log('SignIn callback:', { account, profile, user });
      
      if (account?.provider) {
        // OAuth Sign-in
        console.log('OAuth Sign-in');
        try {
          const res = await userAPI.syncOAuth({
            email: profile?.email,
            name: profile?.name,
            providerId: profile?.sub,
            provider: account.provider,
          });
          
          console.log('syncOAuth response:', res);
          
          if (res.data?.needsRegistration) {
            // New user that needs to complete registration
            // Store the email in the state to pre-fill it in the registration form
            const state = Buffer.from(JSON.stringify({
              email: profile?.email,
              step: 2
            })).toString('base64');
            
            throw new Error(`Registration required#${state}`);
          }
          
          // Existing user - allow sign in
          return true;
        } catch (error) {
          console.error('OAuth Sign-in Error:', error);
          if (error instanceof Error && error.message.startsWith('Registration required#')) {
            // This is our custom error for registration flow - let it through
            throw error;
          }
          return false; // Block sign in for other errors
        }
      } else if (credentials) {
        // Email/Password Sign-in - handled by authorize in CredentialsProvider
        return true;
      }
      return true; // Should not reach here usually
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });
      
      // Handle our custom registration error
      if (url.includes('error=Registration%20required%23')) {
        const errorMessage = url.split('error=')[1];
        const state = errorMessage.split('Registration%20required%23')[1];
        return `${baseUrl}/auth/signin?state=${state}`;
      }
      
      // If the URL is an absolute URL and belongs to the same site, allow it
      if (url.startsWith(baseUrl)) return url;
      
      // If the URL starts with /, it's a relative URL, so append it to the base URL
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      
      // Otherwise, return the training page
      return `${baseUrl}/training`;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async createUser({ user }) {
        // This event fires after a user is created via a provider.
        console.log('User created:', user);
      },
      async signIn({ user, account, profile, isNewUser }) {
        console.log('Sign-in event:', { user, account, profile, isNewUser });
      },
  },
  debug: process.env.NODE_ENV === 'development',
}; 