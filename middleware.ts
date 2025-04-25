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

// Main middleware function
export async function middleware(request: NextRequest) {
  console.log('Middleware started:', request.nextUrl.pathname);
  
  // Get the auth token
  const token = await getToken({ req: request });
  console.log('Token status:', !!token);
  
  // Get the origin, properly handling production environment
  const origin = process.env.NEXT_PUBLIC_BASE_URL || 
    (request.headers.get('x-forwarded-host') 
      ? `https://${request.headers.get('x-forwarded-host')}`
      : request.nextUrl.origin);
  
  const locale = request.nextUrl.pathname.startsWith('/he') ? 'he' : 'en';
  const pathWithoutLocale = request.nextUrl.pathname.replace(/^\/(?:en|he)/, '');
  
  // Check if this is the root path
  const isRootPath = request.nextUrl.pathname === '/' || request.nextUrl.pathname === `/${locale}`;
  
  // Define auth-related paths
  const isLoginPage = pathWithoutLocale === '/login' || pathWithoutLocale === '/auth/signin';
  
  
  // Public paths that don't require authentication checks
  const publicPaths = [
    '/login',
    '/auth/signin',
    '/signup',
    '/auth/signup',
    '/auth/error',
    '/api',
    '/terms',
    '/privacy',
    '/about'
  ];
  
  const isPublicPath = publicPaths.some(path => pathWithoutLocale.startsWith(path));
  
  console.log('Path info:', { 
    origin, 
    locale, 
    pathWithoutLocale,
    isRootPath,
    isLoginPage,
    isPublicPath
  });

  // Handle no token case first
  if (!token) {
    // If trying to access protected route, redirect to login
    if (!isPublicPath) {
      console.log('No token, redirecting to login');
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(`${origin}/${locale}/login?callbackUrl=${callbackUrl}`);
    }
    
    // If on root path, redirect to login
    if (isRootPath) {
      console.log('Root path with no token, redirecting to login');
      return NextResponse.redirect(`${origin}/${locale}/login`);
    }
     // Otherwise continue to public page
    return intlMiddleware(request);
  }

  // If user has token and tries to access login pages, redirect to homepage
  if (token && isLoginPage) {
    console.log('User with token accessing login page, redirecting to homepage');
    return NextResponse.redirect(`${origin}/${locale}`);
  }
  
  // Apply intl middleware for anything else
  return intlMiddleware(request);
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\.svg|.*\\.ico).*)',
  ],
};