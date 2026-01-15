/**
 * SOLAR Platform — Database Mock
 * 
 * In-memory storage for demo purposes.
 * Replace with Prisma in production:
 * 
 * import { PrismaClient } from '@prisma/client';
 * export const prisma = new PrismaClient();
 */

import type { SystemRole, TenantRole, SessionUser } from './auth';
import { hashPassword, generateSessionToken, getSessionExpiry, generateSlug } from './auth';

// ============================================================
// TYPES
// ============================================================

interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  systemRole: SystemRole;
  createdAt: Date;
}

interface Tenant {
  id: string;
  slug: string;
  name: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  createdAt: Date;
}

interface Membership {
  id: string;
  userId: string;
  tenantId: string;
  role: TenantRole;
  createdAt: Date;
}

interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

// ============================================================
// IN-MEMORY STORAGE (Replace with Prisma)
// ============================================================

const users: Map<string, User> = new Map();
const tenants: Map<string, Tenant> = new Map();
const memberships: Map<string, Membership> = new Map();
const sessions: Map<string, Session> = new Map();

// Initialize with demo data
async function initDemoData() {
  // Create demo admin user
  const adminPassword = await hashPassword('Admin123!');
  const adminUser: User = {
    id: 'user_admin',
    email: 'admin@solar.ch',
    password: adminPassword,
    name: 'SOLAR Admin',
    systemRole: 'SOLAR_ADMIN',
    createdAt: new Date(),
  };
  users.set(adminUser.id, adminUser);
  
  // Create demo tenant
  const demoTenant: Tenant = {
    id: 'tenant_demo',
    slug: 'acme-gmbh',
    name: 'ACME GmbH',
    status: 'ACTIVE',
    createdAt: new Date(),
  };
  tenants.set(demoTenant.id, demoTenant);
  
  // Create demo client user
  const clientPassword = await hashPassword('Client123!');
  const clientUser: User = {
    id: 'user_client',
    email: 'client@acme.ch',
    password: clientPassword,
    name: 'Max Mustermann',
    systemRole: 'USER',
    createdAt: new Date(),
  };
  users.set(clientUser.id, clientUser);
  
  // Create membership
  const membership: Membership = {
    id: 'membership_1',
    userId: clientUser.id,
    tenantId: demoTenant.id,
    role: 'OWNER',
    createdAt: new Date(),
  };
  memberships.set(membership.id, membership);
}

// Initialize on module load
initDemoData().catch(console.error);

// ============================================================
// USER OPERATIONS
// ============================================================

export async function findUserByEmail(email: string): Promise<User | null> {
  for (const user of users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return null;
}

export async function findUserById(id: string): Promise<User | null> {
  return users.get(id) ?? null;
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  systemRole?: SystemRole;
}): Promise<User> {
  const hashedPassword = await hashPassword(data.password);
  const user: User = {
    id: `user_${Date.now()}`,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    name: data.name,
    systemRole: data.systemRole ?? 'USER',
    createdAt: new Date(),
  };
  users.set(user.id, user);
  return user;
}

// ============================================================
// TENANT OPERATIONS
// ============================================================

export async function findTenantBySlug(slug: string): Promise<Tenant | null> {
  for (const tenant of tenants.values()) {
    if (tenant.slug === slug) {
      return tenant;
    }
  }
  return null;
}

export async function createTenant(data: {
  name: string;
  slug?: string;
}): Promise<Tenant> {
  const slug = data.slug ?? generateSlug(data.name);
  
  // Ensure unique slug
  let finalSlug = slug;
  let counter = 1;
  while (await findTenantBySlug(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  
  const tenant: Tenant = {
    id: `tenant_${Date.now()}`,
    slug: finalSlug,
    name: data.name,
    status: 'ACTIVE',
    createdAt: new Date(),
  };
  tenants.set(tenant.id, tenant);
  return tenant;
}

// ============================================================
// MEMBERSHIP OPERATIONS
// ============================================================

export async function getUserMemberships(userId: string): Promise<Array<{
  tenantId: string;
  tenantSlug: string;
  role: TenantRole;
}>> {
  const result: Array<{ tenantId: string; tenantSlug: string; role: TenantRole }> = [];
  
  for (const membership of memberships.values()) {
    if (membership.userId === userId) {
      const tenant = tenants.get(membership.tenantId);
      if (tenant) {
        result.push({
          tenantId: membership.tenantId,
          tenantSlug: tenant.slug,
          role: membership.role,
        });
      }
    }
  }
  
  return result;
}

export async function createMembership(data: {
  userId: string;
  tenantId: string;
  role: TenantRole;
}): Promise<Membership> {
  const membership: Membership = {
    id: `membership_${Date.now()}`,
    userId: data.userId,
    tenantId: data.tenantId,
    role: data.role,
    createdAt: new Date(),
  };
  memberships.set(membership.id, membership);
  return membership;
}

// ============================================================
// SESSION OPERATIONS
// ============================================================

export async function createSession(userId: string): Promise<Session> {
  const session: Session = {
    id: `session_${Date.now()}`,
    token: generateSessionToken(),
    userId,
    expiresAt: getSessionExpiry(),
    createdAt: new Date(),
  };
  sessions.set(session.token, session);
  return session;
}

export async function findSessionByToken(token: string): Promise<Session | null> {
  const session = sessions.get(token);
  if (!session) return null;
  
  // Check expiration
  if (session.expiresAt < new Date()) {
    sessions.delete(token);
    return null;
  }
  
  return session;
}

export async function deleteSession(token: string): Promise<void> {
  sessions.delete(token);
}

export async function getSessionUser(token: string): Promise<SessionUser | null> {
  const session = await findSessionByToken(token);
  if (!session) return null;
  
  const user = await findUserById(session.userId);
  if (!user) return null;
  
  const userMemberships = await getUserMemberships(user.id);
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    systemRole: user.systemRole,
    memberships: userMemberships,
  };
}

// ============================================================
// EXPORT PRISMA-LIKE INTERFACE
// ============================================================

export const db = {
  user: {
    findByEmail: findUserByEmail,
    findById: findUserById,
    create: createUser,
  },
  tenant: {
    findBySlug: findTenantBySlug,
    create: createTenant,
  },
  membership: {
    getUserMemberships,
    create: createMembership,
  },
  session: {
    create: createSession,
    findByToken: findSessionByToken,
    delete: deleteSession,
    getUser: getSessionUser,
  },
};
