import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes that require authentication
  const protectedPaths = ['/dashboard', '/upload', '/history', '/settings', '/admin'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Routes that are only for unauthenticated users
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // The httpOnly cookie 'refreshToken' is a good indicator of session existence
  // We don't have the access token here because it's memory-only, but we can check the cookie
  const hasSession = request.cookies.has('refreshToken');

  if (isProtectedPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Optional: Add admin role check via a separate API call or JWT decoding if role is placed in another cookie
  // Since we don't have role in a cookie, we rely on the client to redirect /admin if not admin, 
  // or the backend will block API requests to admin endpoints.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, fonts (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
