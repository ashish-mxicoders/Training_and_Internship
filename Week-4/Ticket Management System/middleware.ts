import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware: Route Protection & Authentication Guard
 * Protects all dashboard routes (/tickets, /analytics, /customers, /settings, /inbox)
 * Redirects unauthenticated users to /login immediately.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow Next.js internals, static files, and public images / screenshots
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/screenshots') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Allow public auth API routes (login, signup, logout, session check)
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  // 3. If user is NOT logged in (no auth_token cookie)
  if (!token) {
    // Allow access only to /login and /signup
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.next();
    }

    // For protected API endpoints, return 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // For protected pages (/tickets, /analytics, /customers, /settings, /inbox, /) redirect to /login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If user IS logged in and attempts to access /login or /signup, redirect to /tickets
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/tickets', request.url));
  }

  // 5. If root URL '/' is accessed by authenticated user, redirect to '/tickets'
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/tickets', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|screenshots).*)',
  ],
};

