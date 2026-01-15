/**
 * POST /api/auth/login
 * 
 * Authenticate user and create session
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, setSessionCookie, getLoginRedirectUrl, isValidEmail } from '@/lib/auth';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json() as LoginRequest;
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'E-Mail oder Passwort ist falsch' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'E-Mail oder Passwort ist falsch' },
        { status: 401 }
      );
    }

    // Create session
    const session = await db.session.create(user.id);

    // Set cookie
    await setSessionCookie(session.token);

    // Get redirect URL based on role
    const sessionUser = await db.session.getUser(session.token);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Sitzung konnte nicht erstellt werden' },
        { status: 500 }
      );
    }

    const redirectUrl = getLoginRedirectUrl(sessionUser);

    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
