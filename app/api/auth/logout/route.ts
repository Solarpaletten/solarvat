/**
 * POST /api/auth/logout
 * 
 * End user session
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionToken, deleteSessionCookie } from '@/lib/auth';

interface LogoutResponse {
  success: boolean;
}

export async function POST(_request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    // Get session token
    const token = await getSessionToken();

    if (token) {
      // Delete session from database
      await db.session.delete(token);
    }

    // Delete cookie
    await deleteSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Still delete cookie even if there's an error
    await deleteSessionCookie();
    return NextResponse.json({ success: true });
  }
}
