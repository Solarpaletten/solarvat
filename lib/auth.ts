// SOLAR Platform — Auth Library
// Simple session-based authentication

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Types
export type SystemRole = 'USER' | 'SOLAR_STAFF' | 'SOLAR_ADMIN'
export type TenantRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  systemRole: SystemRole
}

export interface SessionMembership {
  tenantId: string
  tenantSlug: string
  role: TenantRole
}

export interface Session {
  user: SessionUser
  memberships: SessionMembership[]
}

// Session cookie name
const SESSION_COOKIE = 'solar_session'

// ============================================
// Session Management
// ============================================

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value
  
  if (!sessionToken) {
    return null
  }

  // TODO: In production, validate token against database
  // For now, decode from base64 JSON (dev only)
  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
    return JSON.parse(decoded) as Session
  } catch {
    return null
  }
}

export async function createSession(session: Session): Promise<void> {
  const cookieStore = cookies()
  const encoded = Buffer.from(JSON.stringify(session)).toString('base64')
  
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE)
}

// ============================================
// Auth Guards
// ============================================

export async function requireAuth(): Promise<Session> {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth()
  
  if (session.user.systemRole !== 'SOLAR_ADMIN' && session.user.systemRole !== 'SOLAR_STAFF') {
    redirect('/unauthorized')
  }
  
  return session
}

export async function requireTenantAccess(tenantSlug: string): Promise<{
  session: Session
  membership: SessionMembership
}> {
  const session = await requireAuth()
  
  // Admins have access to all tenants
  if (session.user.systemRole === 'SOLAR_ADMIN' || session.user.systemRole === 'SOLAR_STAFF') {
    return {
      session,
      membership: {
        tenantId: '',
        tenantSlug,
        role: 'OWNER' as TenantRole,
      },
    }
  }
  
  // Check if user is member of this tenant
  const membership = session.memberships.find(m => m.tenantSlug === tenantSlug)
  
  if (!membership) {
    redirect('/unauthorized')
  }
  
  return { session, membership }
}

// ============================================
// Permission Checks
// ============================================

export function canManageTenant(membership: SessionMembership): boolean {
  return membership.role === 'OWNER' || membership.role === 'ADMIN'
}

export function canViewCase(membership: SessionMembership): boolean {
  return true // All members can view
}

export function canEditCase(membership: SessionMembership): boolean {
  return membership.role === 'OWNER' || membership.role === 'ADMIN' || membership.role === 'MEMBER'
}

export function isAdmin(session: Session): boolean {
  return session.user.systemRole === 'SOLAR_ADMIN' || session.user.systemRole === 'SOLAR_STAFF'
}

// ============================================
// Dev Helpers
// ============================================

// Create a mock session for development
export function createMockAdminSession(): Session {
  return {
    user: {
      id: 'admin-001',
      email: 'admin@solar.ch',
      name: 'SOLAR Admin',
      systemRole: 'SOLAR_ADMIN',
    },
    memberships: [],
  }
}

export function createMockClientSession(tenantSlug: string): Session {
  return {
    user: {
      id: 'user-001',
      email: 'client@example.com',
      name: 'Test Client',
      systemRole: 'USER',
    },
    memberships: [
      {
        tenantId: 'tenant-001',
        tenantSlug,
        role: 'OWNER',
      },
    ],
  }
}
