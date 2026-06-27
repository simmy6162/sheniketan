import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireRole } from '@/lib/require-role';
import type { ObjectId } from 'mongodb';

interface RoomDoc {
  _id?: ObjectId;
  roomNumber: string;
  type: string;
  capacity: number;
  occupied: number;
  status: string;
  residents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  const { session, error } = await requireRole('admin', 'warden');
  if (error) return error;

  try {
    const db = await connectToDatabase();
    const rooms = await db.collection<RoomDoc>('rooms').find({}).sort({ roomNumber: 1 }).toArray();

    const residents = await db.collection('users')
      .find({ role: 'member' })
      .project({ name: 1, email: 1, roomNumber: 1, occupation: 1, age: 1, allocationStatus: 1 })
      .toArray();

    const residentMap = new Map<string, any>();
    residents.forEach((r: any) => {
      residentMap.set(r._id.toString(), r);
    });

    const enriched = rooms.map((room) => ({
      id: room._id?.toString(),
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      occupied: room.occupied,
      status: room.status,
      residents: (room.residents || []).map((rid: string) => {
        const resident = residentMap.get(rid);
        return resident
          ? { id: rid, name: resident.name, occupation: resident.occupation, age: resident.age }
          : { id: rid, name: 'Unknown', occupation: undefined, age: undefined };
      }),
      createdAt: room.createdAt,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (err) {
    console.error('[LIST ROOMS ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to load rooms.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole('admin', 'warden');
  if (error) return error;

  try {
    const { roomNumber, type, capacity } = await req.json();

    if (!roomNumber || !type || !capacity) {
      return NextResponse.json(
        { success: false, message: 'Room number, type, and capacity are required.' },
        { status: 400 }
      );
    }

    if (!['Single', 'Shared'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Type must be Single or Shared.' },
        { status: 400 }
      );
    }

    if (capacity < 1 || capacity > 6) {
      return NextResponse.json(
        { success: false, message: 'Capacity must be between 1 and 6.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const rooms = db.collection('rooms');

    const existing = await rooms.findOne({ roomNumber: roomNumber.trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A room with this number already exists.' },
        { status: 409 }
      );
    }

    const newRoom: RoomDoc = {
      roomNumber: roomNumber.trim(),
      type,
      capacity: Number(capacity),
      occupied: 0,
      status: 'Vacant',
      residents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await rooms.insertOne(newRoom);

    return NextResponse.json(
      {
        success: true,
        message: `Room ${roomNumber} created successfully.`,
        data: {
          id: newRoom._id?.toString(),
          roomNumber: newRoom.roomNumber,
          type: newRoom.type,
          capacity: newRoom.capacity,
          status: newRoom.status,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[CREATE ROOM ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create room.' },
      { status: 500 }
    );
  }
}
