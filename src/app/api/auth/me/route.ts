import { NextResponse } from 'next/server';
import { getSession } from '@/lib/get-session';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Session active.',
    data: {
      userId: session.userId,
      email: session.email,
      role: session.role,
      name: session.name,
    },
  });
}
