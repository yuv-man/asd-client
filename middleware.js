import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'he'],
  
  // Default locale if no match
  defaultLocale: 'en',
  
  // This function is called to determine the locale for a request
  localeDetection: (request) => {
    // Try to get the locale from cookies first (user preference)
    const userLocale = request.cookies.get('userLocale')?.value;
    
    if (userLocale && ['en', 'he'].includes(userLocale)) {
      return userLocale;
    }
    
    // Fallback to the Accept-Language header
    return null; // Will use the built-in detection
  }
});
 
export const config = {
  // Match all pathnames except for
  // - API routes (/api/*)
  // - Static files (/_next/*)
  // - Images and other assets (/images/*, etc.)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};