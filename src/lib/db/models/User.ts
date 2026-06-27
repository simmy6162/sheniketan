import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'member' | 'warden' | 'admin';
export type Occupation = 'Student' | 'Working' | 'Intern' | 'Exam Prep';
export type PreferredRoomType = 'Single' | 'Shared';
export type AllocationStatus = 'Pending' | 'Allocated' | 'Waitlisted' | 'None';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  roomNumber?: string;
  age?: number;
  occupation?: Occupation;
  preferredRoomType?: PreferredRoomType;
  allocationStatus?: AllocationStatus;
  allocationMessage?: string;
  createdAt: Date;
  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['member', 'warden', 'admin'],
      default: 'member',
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
    },
    age: {
      type: Number,
      min: [16, 'Age must be at least 16'],
      max: [100, 'Age must be at most 100'],
    },
    occupation: {
      type: String,
      enum: ['Student', 'Working', 'Intern', 'Exam Prep'],
    },
    preferredRoomType: {
      type: String,
      enum: ['Single', 'Shared'],
      default: 'Single',
    },
    allocationStatus: {
      type: String,
      enum: ['Pending', 'Allocated', 'Waitlisted', 'None'],
      default: 'None',
    },
    allocationMessage: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
