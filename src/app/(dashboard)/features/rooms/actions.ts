'use server';

import { connectToDatabase } from '@/lib/db';
import type { User, Occupation } from '@/types';

interface MatchmakeInput {
  age?: number;
  occupation?: Occupation;
}

interface MatchmakeResult {
  success: boolean;
  message: string;
  roomNumber?: string;
  roommateInfo?: string;
}

function computeMatchScore(
  newAge: number | undefined,
  newOccupation: Occupation | undefined,
  existingAge: number | undefined,
  existingOccupation: Occupation | undefined
): number {
  let score = 0;

  if (newOccupation && existingOccupation && newOccupation === existingOccupation) {
    score += 100;
  }

  if (newAge && existingAge) {
    const ageDiff = Math.abs(newAge - existingAge);
    score += Math.max(0, 50 - ageDiff);
  }

  return score;
}

export async function allocateSharedRoom(
  userId: string,
  input: MatchmakeInput
): Promise<MatchmakeResult> {
  const db = await connectToDatabase();
  const users = db.collection<User>('users');
  const rooms = db.collection('rooms');

  const resident = await users.findOne({ _id: userId } as any);
  if (!resident) {
    return { success: false, message: 'Resident not found.' };
  }

  if (resident.roomNumber) {
    return { success: false, message: 'Resident already has a room allocated.' };
  }

  const sharedRooms = await rooms
    .find({
      type: 'Shared',
      status: { $in: ['Vacant', 'Partially Occupied'] },
    })
    .toArray();

  if (sharedRooms.length === 0) {
    await users.updateOne(
      { _id: userId } as any,
      {
        $set: {
          allocationStatus: 'Waitlisted',
          allocationMessage: 'No shared rooms available. You have been placed on the waitlist.',
        },
      }
    );
    return {
      success: false,
      message: 'No shared rooms available. You have been placed on the waitlist.',
    };
  }

  let bestRoom: any = null;
  let bestScore = -1;
  let bestRoommates: any[] = [];

  const partiallyOccupied = sharedRooms.filter(
    (r: any) => r.occupied > 0 && r.occupied < r.capacity && r.status === 'Partially Occupied'
  );

  for (const room of partiallyOccupied) {
    const residentIds = (room.residents || []).map((id: any) => id.toString());

    const existingResidents = await users
      .find({ _id: { $in: residentIds.map((id: string) => ({ $oid: id })) } } as any)
      .toArray();

    let roomScore = 0;
    for (const existing of existingResidents) {
      const score = computeMatchScore(
        input.age,
        input.occupation,
        (existing as any).age,
        (existing as any).occupation as Occupation
      );
      roomScore = Math.max(roomScore, score);
    }

    if (roomScore > bestScore) {
      bestScore = roomScore;
      bestRoom = room;
      bestRoommates = existingResidents;
    }
  }

  if (bestRoom) {
    const roommateNames = bestRoommates.map((r: any) => r.name).join(', ');
    const message = bestScore >= 100
      ? `Matched with ${roommateNames} (same occupation) in Room ${bestRoom.roomNumber}.`
      : bestScore > 0
        ? `Allocated to Room ${bestRoom.roomNumber} with ${roommateNames} (age proximity).`
        : `Allocated to Room ${bestRoom.roomNumber} (partially occupied).`;

    await rooms.updateOne(
      { _id: bestRoom._id },
      {
        $addToSet: { residents: userId },
        $inc: { occupied: 1 },
        $set: {
          status: bestRoom.occupied + 1 >= bestRoom.capacity ? 'Occupied' : 'Partially Occupied',
        },
      }
    );

    await users.updateOne(
      { _id: userId } as any,
      {
        $set: {
          roomNumber: bestRoom.roomNumber,
          allocationStatus: 'Allocated',
          allocationMessage: message,
        },
      }
    );

    return {
      success: true,
      message,
      roomNumber: bestRoom.roomNumber,
      roommateInfo: bestRoommates.map((r: any) => r.name).join(', '),
    };
  }

  const vacantRooms = sharedRooms.filter(
    (r: any) => r.occupied === 0 && r.status === 'Vacant'
  );

  if (vacantRooms.length > 0) {
    const room = vacantRooms[0];
    const message = `Allocated to Room ${room.roomNumber} (newly assigned shared room).`;

    await rooms.updateOne(
      { _id: room._id },
      {
        $addToSet: { residents: userId },
        $inc: { occupied: 1 },
        $set: { status: 'Partially Occupied' },
      }
    );

    await users.updateOne(
      { _id: userId } as any,
      {
        $set: {
          roomNumber: room.roomNumber,
          allocationStatus: 'Allocated',
          allocationMessage: message,
        },
      }
    );

    return {
      success: true,
      message,
      roomNumber: room.roomNumber,
    };
  }

  await users.updateOne(
    { _id: userId } as any,
    {
      $set: {
        allocationStatus: 'Waitlisted',
        allocationMessage: 'No shared rooms available. You have been placed on the waitlist.',
      },
    }
  );

  return {
    success: false,
    message: 'No shared rooms available. You have been placed on the waitlist.',
  };
}
