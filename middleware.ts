
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'solar_session';

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/catalog',
  '/calculator',
];

// Routes that require SOLAR staff access
const adminRoutes = ['/admin'];

// Routes that require tenant access
const portalRoutes = ['/portal'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  // ============================================================
  // PUBLIC ROUTES
  // ============================================================
  
  // Allow public routes and API routes
  if (
    publicRoutes.some(route => pathname === route) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/routes/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ============================================================
  // AUTHENTICATION CHECK
  // ============================================================
  
  const isAuthenticated = !!sessionCookie?.value;

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ============================================================
  // ADMIN ROUTES
  // ============================================================
  
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Note: Full role check happens in the page components
    // Middleware only checks if session exists
    // For production, decode session token and check role here
    return NextResponse.next();
  }

  // ============================================================
  // PORTAL ROUTES
  // ============================================================
  
  if (portalRoutes.some(route => pathname.startsWith(route))) {
    // Note: Tenant access check happens in page components
    // For production, verify tenant membership here
    return NextResponse.next();
  }

  // Allow all other authenticated requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
