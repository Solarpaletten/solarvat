/**
 * SOLAR Platform — Auth Utilities
 * 
 * Sprint 3: Production-ready authentication
 * 
 * Features:
 * - bcrypt password hashing (production)
 * - SHA-256 fallback (development without bcrypt)
 * - HttpOnly session cookies
 * - Role-based authorization
 */

import { cookies } from 'next/headers';

// ============================================================
// CONSTANTS
// ============================================================

export const SESSION_COOKIE = 'solar_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
const BCRYPT_ROUNDS = 12;

// ============================================================
// TYPES
// ============================================================

export type SystemRole = 'SOLAR_ADMIN' | 'SOLAR_STAFF' | 'USER';
export type TenantRole = 'OWNER' | 'MEMBER';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  systemRole: SystemRole;
  memberships: {
    tenantId: string;
    tenantSlug: string;
    role: TenantRole;
  }[];
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  user: SessionUser;
}

// ============================================================
// PASSWORD HASHING
// ============================================================

// Try to use bcrypt, fallback to SHA-256 if not available
let bcryptModule: typeof import('bcrypt') | null = null;

async function loadBcrypt(): Promise<typeof import('bcrypt') | null> {
  if (bcryptModule !== null) return bcryptModule;
  
  try {
    bcryptModule = await import('bcrypt');
    return bcryptModule;
  } catch {
    console.warn('bcrypt not available, using SHA-256 fallback');
    return null;
  }
}

/**
 * Hash password using bcrypt (production) or SHA-256 (fallback)
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await loadBcrypt();
  
  if (bcrypt) {
    // Production: use bcrypt
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
  
  // Fallback: use SHA-256 (development only)
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'solar_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Check if hash is SHA-256 fallback
  if (hash.startsWith('sha256:')) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
  }
  
  // Production: use bcrypt
  const bcrypt = await loadBcrypt();
  if (bcrypt) {
    return bcrypt.compare(password, hash);
  }
  
  // Fallback verification
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================

/**
 * Generate secure random token
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate session expiration date
 */
export function getSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE * 1000);
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Delete session cookie
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Get session token from cookie
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  return cookie?.value ?? null;
}

// ============================================================
// AUTHORIZATION HELPERS
// ============================================================

/**
 * Check if user is SOLAR staff (admin or staff)
 */
export function isStaff(user: SessionUser): boolean {
  return user.systemRole === 'SOLAR_ADMIN' || user.systemRole === 'SOLAR_STAFF';
}

/**
 * Check if user is SOLAR admin
 */
export function isAdmin(user: SessionUser): boolean {
  return user.systemRole === 'SOLAR_ADMIN';
}

/**
 * Check if user has access to tenant
 */
export function hasTenantAccess(user: SessionUser, tenantSlug: string): boolean {
  // Staff has access to all tenants
  if (isStaff(user)) return true;
  
  // Check membership
  return user.memberships.some(m => m.tenantSlug === tenantSlug);
}

/**
 * Check if user is tenant owner
 */
export function isTenantOwner(user: SessionUser, tenantSlug: string): boolean {
  return user.memberships.some(
    m => m.tenantSlug === tenantSlug && m.role === 'OWNER'
  );
}

/**
 * Get redirect URL after login based on user role
 */
export function getLoginRedirectUrl(user: SessionUser): string {
  // Staff goes to admin
  if (isStaff(user)) {
    return '/admin';
  }
  
  // Regular user goes to their first tenant's portal
  const firstMembership = user.memberships[0];
  if (firstMembership) {
    return `/portal/${firstMembership.tenantSlug}/dashboard`;
  }
  
  // No membership - go to home
  return '/';
}

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Passwort muss mindestens 8 Zeichen haben' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Passwort muss mindestens einen Großbuchstaben enthalten' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Passwort muss mindestens einen Kleinbuchstaben enthalten' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Passwort muss mindestens eine Zahl enthalten' };
  }
  return { valid: true };
}

/**
 * Generate slug from company name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
