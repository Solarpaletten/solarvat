/**
 * GET /api/auth/me
 * 
 * Get current authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionToken, type SessionUser } from '@/lib/auth';

interface MeResponse {
  authenticated: boolean;
  user?: SessionUser;
}

export async function GET(_request: NextRequest): Promise<NextResponse<MeResponse>> {
  try {
    // Get session token from cookie
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    // Get user from session
    const user = await db.session.getUser(token);

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
