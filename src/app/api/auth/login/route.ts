import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role: selectedRole } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (selectedRole && !['member', 'warden'].includes(selectedRole)) {
      return NextResponse.json(
        { success: false, message: 'Invalid login role.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const users = db.collection<User>('users');

    // Find member or warden — not admin (admin has a separate login)
    const user = await users.findOne({
      email: email.toLowerCase().trim(),
      role: { $in: ['member', 'warden'] },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (selectedRole && user.role !== selectedRole) {
      const roleLabel = selectedRole === 'warden' ? 'Warden' : 'Resident';
      return NextResponse.json(
        {
          success: false,
          message: `These credentials are not registered as a ${roleLabel}. Switch tabs and try again.`,
        },
        { status: 403 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Your account is inactive. Please contact the warden.' },
        { status: 403 }
      );
    }

    const token = await signToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Determine redirect path based on role
    const redirectPath = user.role === 'warden' ? '/resident' : '/resident';

    const response = NextResponse.json(
      {
        success: true,
        message: `Welcome back, ${user.name}!`,
        data: { role: user.role, name: user.name, redirectTo: redirectPath },
      },
      { status: 200 }
    );

    // Set HttpOnly cookie
    response.cookies.set('sn_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
