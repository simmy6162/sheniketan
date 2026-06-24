import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password, adminKey } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Optional secondary admin key gate (set ADMIN_SECRET in .env.local)
    const requiredAdminKey = process.env.ADMIN_SECRET;
    if (requiredAdminKey && adminKey !== requiredAdminKey) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin access key.' },
        { status: 403 }
      );
    }

    const db = await connectToDatabase();
    const users = db.collection<User>('users');

    const user = await users.findOne({
      email: email.toLowerCase().trim(),
      role: 'admin',
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'This admin account is inactive.' },
        { status: 403 }
      );
    }

    const token = await signToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: `Admin access granted. Welcome, ${user.name}.`,
        data: { role: 'admin', name: user.name, redirectTo: '/admin' },
      },
      { status: 200 }
    );

    response.cookies.set('sn_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[ADMIN LOGIN ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
