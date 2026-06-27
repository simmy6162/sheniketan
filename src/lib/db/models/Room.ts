import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type RoomType = 'Single' | 'Shared';
export type RoomStatus = 'Vacant' | 'Partially Occupied' | 'Occupied' | 'Maintenance';

export interface IRoom extends Document {
  _id: mongoose.Types.ObjectId;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  occupied: number;
  status: RoomStatus;
  residents: mongoose.Types.ObjectId[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Single', 'Shared'],
      required: [true, 'Room type is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      validate: {
        validator: (value: number) => value > 0,
        message: 'Capacity must be greater than 0',
      },
    },
    occupied: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value: number) {
          return value >= 0 && value <= (this as IRoom).capacity;
        },
        message: 'Occupied count cannot exceed capacity or be negative',
      },
    },
    status: {
      type: String,
      enum: ['Vacant', 'Partially Occupied', 'Occupied', 'Maintenance'],
      default: 'Vacant',
    },
    residents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

RoomSchema.index({ roomNumber: 1 });

export const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
