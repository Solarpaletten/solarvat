import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'solar_session'

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',  // Public home (catalog)
]

// Routes that require admin access
const adminRoutes = [
  '/admin',
]

// Routes that require portal access (tenant-specific)
const portalRoutes = [
  '/portal',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  
  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/routes/'))) {
    return NextResponse.next()
  }
  
  // Check if user is authenticated
  const isAuthenticated = !!sessionCookie?.value
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Admin routes → admin login
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }
    
    // Portal routes → portal login
    if (pathname.startsWith('/portal')) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }
  }
  
  // For authenticated users, validate access
  if (isAuthenticated && sessionCookie?.value) {
    try {
      const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
      const session = JSON.parse(decoded)
      
      // Admin routes require admin role
      if (pathname.startsWith('/admin')) {
        if (session.user.systemRole !== 'SOLAR_ADMIN' && session.user.systemRole !== 'SOLAR_STAFF') {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
      
      // Portal routes require tenant membership
      if (pathname.startsWith('/portal/')) {
        const tenantSlug = pathname.split('/')[2]
        
        // Admins can access all tenants
        if (session.user.systemRole === 'SOLAR_ADMIN' || session.user.systemRole === 'SOLAR_STAFF') {
          return NextResponse.next()
        }
        
        // Check if user has access to this tenant
        const hasMembership = session.memberships?.some(
          (m: { tenantSlug: string }) => m.tenantSlug === tenantSlug
        )
        
        if (!hasMembership) {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    } catch {
      // Invalid session, clear cookie and redirect
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete(SESSION_COOKIE)
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
