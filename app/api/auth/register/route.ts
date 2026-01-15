/**
 * POST /api/auth/register
 * 
 * Register new user with tenant
 * Creates: User + Tenant + Membership
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSessionCookie, isValidEmail, isValidPassword, generateSlug } from '@/lib/auth';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  companyName: string;
}

interface RegisterResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse>> {
  try {
    const body = await request.json() as RegisterRequest;
    const { email, password, name, companyName } = body;

    // ============================================================
    // VALIDATION
    // ============================================================

    // Check required fields
    if (!email || !password || !name || !companyName) {
      return NextResponse.json(
        { success: false, error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordCheck = isValidPassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, error: passwordCheck.error },
        { status: 400 }
      );
    }

    // Validate name
    if (name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name muss mindestens 2 Zeichen haben' },
        { status: 400 }
      );
    }

    // Validate company name
    if (companyName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Firmenname muss mindestens 2 Zeichen haben' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Diese E-Mail-Adresse ist bereits registriert' },
        { status: 409 }
      );
    }

    // ============================================================
    // CREATE USER + TENANT + MEMBERSHIP
    // ============================================================

    // 1. Create Tenant
    const tenant = await db.tenant.create({
      name: companyName,
      slug: generateSlug(companyName),
    });

    // 2. Create User
    const user = await db.user.create({
      email,
      password,
      name,
      systemRole: 'USER',
    });

    // 3. Create Membership (User as Tenant Owner)
    await db.membership.create({
      userId: user.id,
      tenantId: tenant.id,
      role: 'OWNER',
    });

    // ============================================================
    // CREATE SESSION
    // ============================================================

    const session = await db.session.create(user.id);
    await setSessionCookie(session.token);

    // Redirect to tenant portal
    const redirectUrl = `/portal/${tenant.slug}/dashboard`;

    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
