import { NextResponse } from 'next/server';
import { getSession } from '@/lib/get-session';
import type { UserRole } from '@/types';

export async function requireRole(...roles: UserRole[]) {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: 'Authentication required.' },
        { status: 401 }
      ),
    };
  }

  if (!roles.includes(session.role)) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: 'You do not have permission for this action.' },
        { status: 403 }
      ),
    };
  }

  return { session, error: null };
}
