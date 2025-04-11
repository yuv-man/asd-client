import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Create the intl middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'he'],
  defaultLocale: 'en',
  localeDetection: false
});

// Server-safe API call function
async function getUserByEmail(email: string) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error("API URL environment variable not defined");
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

// Main middleware function
export async function middleware(request: NextRequest) {
  // Get the auth token
  const token = await getToken({ req: request });
  const origin = request.nextUrl.origin;
  const locale = request.nextUrl.pathname.startsWith('/he') ? 'he' : 'en';
  const isLoginPage = /^\/(?:en|he)\/login\/?$/.test(request.nextUrl.pathname);

  // Special case for root path
  if (request.nextUrl.pathname === '/') {
    // Flow 2: No token => redirect to login
    if (!token || !token.email) {
      return NextResponse.redirect(`${origin}/${locale}/login`);
    }
    
    // For Flow 1 & 3, check if user exists
    try {
      const userData = await getUserByEmail(token.email as string);
      
      if (!userData || !userData.data) {
        // Flow 3: Token + No user => redirect to login step 2
        return NextResponse.redirect(`${origin}/${locale}/login?step=2`);
      }
      
      // Flow 1: Token + User => redirect to training
      return NextResponse.redirect(`${origin}/${locale}/training`);
    } catch (error) {
      console.error('Error in middleware:', error);
      // Default to login page on error
      return NextResponse.redirect(`${origin}/${locale}/login`);
    }
  }
  
  // For non-root paths
  if (!token && !isLoginPage) {
    // Flow 2: No token on protected route => redirect to login
    return NextResponse.redirect(`${origin}/${locale}/login`);
  }
  
  if (token && token.email && isLoginPage) {
    try {
      const userData = await getUserByEmail(token.email as string);
      
      if (!userData || !userData.data) {
        // Flow 3: Token + No user on login page => ensure on step 2
        // Only redirect if not already on step 2
        const currentStep = new URL(request.url).searchParams.get('step');
        if (currentStep !== '2') {
          return NextResponse.redirect(`${origin}/${locale}/login?step=2`);
        }
        // Otherwise stay on login page with step=2
        return NextResponse.next();
      }
      // Flow 1: Token + User on login page => redirect to training
      return NextResponse.redirect(`${origin}/${locale}/training`);
    } catch (error) {
      console.error('Error in middleware:', error);
      // Stay on login page on error
      return NextResponse.next();
    }
  }
  
  // Apply intl middleware for everything else
  return intlMiddleware(request);
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.svg).*)']
}