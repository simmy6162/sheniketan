import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireRole } from '@/lib/require-role';
import type { User } from '@/types';

export async function GET() {
  const { session, error } = await requireRole('admin', 'warden');
  if (error) return error;

  try {
    const db = await connectToDatabase();
    const unallocated = await db
      .collection<User>('users')
      .find({
        role: 'member',
        isActive: true,
        $or: [
          { roomNumber: '' },
          { roomNumber: { $exists: false } },
          { roomNumber: null },
        ],
      })
      .project({ passwordHash: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: unallocated.map((u) => ({
        id: u._id?.toString(),
        name: u.name,
        email: u.email,
        occupation: u.occupation,
        age: u.age,
        allocationStatus: u.allocationStatus,
      })),
    });
  } catch (err) {
    console.error('[LIST UNALLOCATED ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to load unallocated residents.' },
      { status: 500 }
    );
  }
}
