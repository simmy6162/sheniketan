import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import type { SessionPayload } from '@/types';

export type Session = SessionPayload & { exp: number };

/**
 * Reads and verifies the current session from the sn_session cookie.
 * Safe to call from Server Components and Route Handlers.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sn_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}
