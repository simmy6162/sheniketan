import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireRole } from '@/lib/require-role';
import type { User } from '@/types';

export async function GET() {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    const db = await connectToDatabase();
    const wardens = await db
      .collection<User>('users')
      .find({ role: 'warden' })
      .project({ passwordHash: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: wardens.map((w) => ({
        id: w._id?.toString(),
        name: w.name,
        email: w.email,
        phone: w.phone || '',
        isActive: w.isActive,
        createdAt: w.createdAt,
      })),
    });
  } catch (err) {
    console.error('[LIST WARDENS ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to load wardens.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    const { name, email, password, phone } = await req.json();

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

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const warden: User = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: 'warden',
      phone: phone?.trim() || '',
      createdAt: new Date(),
      isActive: true,
    };

    const result = await users.insertOne(warden);

    return NextResponse.json(
      {
        success: true,
        message: 'Warden account created. Share these credentials with the warden in person.',
        data: {
          id: result.insertedId.toString(),
          name: warden.name,
          email: warden.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[CREATE WARDEN ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create warden account.' },
      { status: 500 }
    );
  }
}
