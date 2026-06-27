import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireRole } from '@/lib/require-role';
import { ObjectId } from 'mongodb';
import type { User } from '@/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole('admin', 'warden');
  if (error) return error;

  try {
    const { id: roomId } = await params;
    const { residentId } = await req.json();

    if (!ObjectId.isValid(roomId) || !ObjectId.isValid(residentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid room or resident ID.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const rooms = db.collection('rooms');
    const users = db.collection<User>('users');

    const room = await rooms.findOne({ _id: new ObjectId(roomId) });
    if (!room) {
      return NextResponse.json(
        { success: false, message: 'Room not found.' },
        { status: 404 }
      );
    }

    const resident = await users.findOne({ _id: new ObjectId(residentId) } as any);
    if (!resident) {
      return NextResponse.json(
        { success: false, message: 'Resident not found.' },
        { status: 404 }
      );
    }

    if (!room.residents.includes(residentId)) {
      return NextResponse.json(
        { success: false, message: `${resident.name} is not in Room ${room.roomNumber}.` },
        { status: 400 }
      );
    }

    const newOccupied = Math.max(0, room.occupied - 1);
    const newStatus = newOccupied === 0 ? 'Vacant' : newOccupied < room.capacity ? 'Partially Occupied' : 'Occupied';

    await rooms.updateOne(
      { _id: new ObjectId(roomId) },
      {
        $pull: { residents: residentId },
        $inc: { occupied: -1 },
        $set: { status: newStatus, updatedAt: new Date() },
      }
    );

    await users.updateOne(
      { _id: new ObjectId(residentId) } as any,
      {
        $set: {
          roomNumber: '',
          allocationStatus: 'None',
          allocationMessage: '',
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `${resident.name} removed from Room ${room.roomNumber}.`,
    });
  } catch (err) {
    console.error('[DEALLOCATE ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to deallocate room.' },
      { status: 500 }
    );
  }
}
