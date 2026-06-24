import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role } = await req.json();

    if (role && role !== 'member') {
      return NextResponse.json(
        { success: false, message: 'Only resident (member) self-registration is allowed.' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const users = db.collection<User>('users');

    await users.createIndex({ email: 1 }, { unique: true }).catch(() => null);

    // Check for existing user
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Create member user
    const newUser: User = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      role: 'member',
      phone: phone || '',
      createdAt: new Date(),
      isActive: true,
    };

    await users.insertOne(newUser);

    return NextResponse.json(
      { success: true, message: 'Account created successfully! Please log in.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
