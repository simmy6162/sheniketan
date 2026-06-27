import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireRole } from '@/lib/require-role';
import { ObjectId } from 'mongodb';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole('admin', 'warden');
  if (error) return error;

  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid room ID.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updates: Record<string, any> = {};

    if (body.roomNumber !== undefined) updates.roomNumber = body.roomNumber.trim();
    if (body.type !== undefined) {
      if (!['Single', 'Shared'].includes(body.type)) {
        return NextResponse.json(
          { success: false, message: 'Type must be Single or Shared.' },
          { status: 400 }
        );
      }
      updates.type = body.type;
    }
    if (body.capacity !== undefined) {
      const cap = Number(body.capacity);
      if (cap < 1 || cap > 6) {
        return NextResponse.json(
          { success: false, message: 'Capacity must be between 1 and 6.' },
          { status: 400 }
        );
      }
      updates.capacity = cap;
    }
    if (body.status !== undefined) {
      if (!['Vacant', 'Partially Occupied', 'Occupied', 'Maintenance'].includes(body.status)) {
        return NextResponse.json(
          { success: false, message: 'Invalid status value.' },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update.' },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();

    const db = await connectToDatabase();
    const result = await db.collection('rooms').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Room not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Room updated successfully.',
      data: {
        id: result._id?.toString(),
        roomNumber: result.roomNumber,
        type: result.type,
        capacity: result.capacity,
        occupied: result.occupied,
        status: result.status,
      },
    });
  } catch (err) {
    console.error('[UPDATE ROOM ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update room.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireRole('admin', 'warden');
  if (error) return error;

  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid room ID.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const room = await db.collection('rooms').findOne({ _id: new ObjectId(id) });

    if (!room) {
      return NextResponse.json(
        { success: false, message: 'Room not found.' },
        { status: 404 }
      );
    }

    if (room.occupied > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete a room with residents. Deallocate all residents first.' },
        { status: 400 }
      );
    }

    await db.collection('rooms').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: `Room ${room.roomNumber} deleted successfully.`,
    });
  } catch (err) {
    console.error('[DELETE ROOM ERROR]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete room.' },
      { status: 500 }
    );
  }
}
