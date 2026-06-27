import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { allocateSharedRoom } from '@/app/(dashboard)/features/rooms/actions';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, age, occupation, preferredRoomType } = await req.json();

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

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const newUser: User = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      role: 'member',
      phone: phone || '',
      age: age || undefined,
      occupation: occupation || undefined,
      preferredRoomType: preferredRoomType || 'Single',
      allocationStatus: 'None',
      allocationMessage: '',
      createdAt: new Date(),
      isActive: true,
    };

    const result = await users.insertOne(newUser);
    const userId = result.insertedId.toString();

    let allocationResult = null;
    if (preferredRoomType === 'Shared') {
      try {
        allocationResult = await allocateSharedRoom(userId, {
          age: age || undefined,
          occupation: occupation || undefined,
        });
      } catch (err) {
        console.error('[REGISTER ALLOCATION ERROR]', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: allocationResult?.success
          ? `Account created and room allocated! ${allocationResult.message}`
          : 'Account created successfully! Please log in.',
        data: {
          id: userId,
          allocation: allocationResult,
        },
      },
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
