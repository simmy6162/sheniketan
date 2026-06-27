/**
 * Common database utility functions
 * Reusable patterns for CRUD operations
 */

import { connectMongoose } from './mongoose';
import {
  User,
  Room,
  Complaint,
  LeaveRequest,
  Notice,
  ResidenceSettings,
  type IUser,
  type IRoom,
  type IComplaint,
  type ILeaveRequest,
  type INotice,
  type IResidenceSettings,
} from './models';
import mongoose from 'mongoose';

/**
 * Ensures database connection before operations
 */
export async function ensureConnection(): Promise<void> {
  try {
    await connectMongoose();
  } catch (error) {
    throw new Error('Failed to connect to database: ' + String(error));
  }
}

/**
 * User operations
 */
export const UserOps = {
  async findByEmail(email: string): Promise<IUser | null> {
    await ensureConnection();
    return User.findOne({ email }).select('+passwordHash');
  },

  async findById(id: string): Promise<IUser | null> {
    await ensureConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return User.findById(id);
  },

  async create(data: Partial<IUser>): Promise<IUser> {
    await ensureConnection();
    return User.create(data);
  },

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await ensureConnection();
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
};

/**
 * Room operations
 */
export const RoomOps = {
  async findByNumber(roomNumber: string): Promise<IRoom | null> {
    await ensureConnection();
    return Room.findOne({ roomNumber }).populate('residents');
  },

  async findById(id: string): Promise<IRoom | null> {
    await ensureConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Room.findById(id).populate('residents');
  },

  async findAll(filters?: Record<string, any>): Promise<IRoom[]> {
    await ensureConnection();
    return Room.find(filters || {}).populate('residents');
  },

  async create(data: Partial<IRoom>): Promise<IRoom> {
    await ensureConnection();
    return Room.create(data);
  },

  async updateById(id: string, data: Partial<IRoom>): Promise<IRoom | null> {
    await ensureConnection();
    return Room.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'residents'
    );
  },

  async addResident(roomId: string, userId: string): Promise<IRoom | null> {
    await ensureConnection();
    return Room.findByIdAndUpdate(
      roomId,
      {
        $addToSet: { residents: userId },
        $inc: { occupied: 1 },
      },
      { new: true, runValidators: true }
    ).populate('residents');
  },

  async removeResident(roomId: string, userId: string): Promise<IRoom | null> {
    await ensureConnection();
    return Room.findByIdAndUpdate(
      roomId,
      {
        $pull: { residents: userId },
        $inc: { occupied: -1 },
      },
      { new: true, runValidators: true }
    ).populate('residents');
  },
};

/**
 * Complaint operations
 */
export const ComplaintOps = {
  async findById(id: string): Promise<IComplaint | null> {
    await ensureConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Complaint.findById(id).populate('residentId', 'name email phone');
  },

  async findByResident(residentId: string): Promise<IComplaint[]> {
    await ensureConnection();
    return Complaint.find({ residentId })
      .sort({ createdAt: -1 })
      .populate('residentId', 'name email phone');
  },

  async findAll(filters?: Record<string, any>): Promise<IComplaint[]> {
    await ensureConnection();
    return Complaint.find(filters || {})
      .sort({ createdAt: -1 })
      .populate('residentId', 'name email phone');
  },

  async create(data: Partial<IComplaint>): Promise<IComplaint> {
    await ensureConnection();
    return Complaint.create(data);
  },

  async updateById(id: string, data: Partial<IComplaint>): Promise<IComplaint | null> {
    await ensureConnection();
    return Complaint.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('residentId', 'name email phone');
  },

  async updateStatus(id: string, status: string, adminReply?: string): Promise<IComplaint | null> {
    await ensureConnection();
    return Complaint.findByIdAndUpdate(
      id,
      { status, ...(adminReply && { adminReply }) },
      { new: true }
    ).populate('residentId', 'name email phone');
  },
};

/**
 * Leave Request operations
 */
export const LeaveRequestOps = {
  async findById(id: string): Promise<ILeaveRequest | null> {
    await ensureConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return LeaveRequest.findById(id).populate('residentId', 'name email');
  },

  async findByResident(residentId: string): Promise<ILeaveRequest[]> {
    await ensureConnection();
    return LeaveRequest.find({ residentId })
      .sort({ createdAt: -1 })
      .populate('residentId', 'name email');
  },

  async findAll(filters?: Record<string, any>): Promise<ILeaveRequest[]> {
    await ensureConnection();
    return LeaveRequest.find(filters || {})
      .sort({ createdAt: -1 })
      .populate('residentId', 'name email');
  },

  async create(data: Partial<ILeaveRequest>): Promise<ILeaveRequest> {
    await ensureConnection();
    return LeaveRequest.create(data);
  },

  async updateById(id: string, data: Partial<ILeaveRequest>): Promise<ILeaveRequest | null> {
    await ensureConnection();
    return LeaveRequest.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('residentId', 'name email');
  },

  async updateStatus(id: string, status: string): Promise<ILeaveRequest | null> {
    await ensureConnection();
    return LeaveRequest.findByIdAndUpdate(id, { status }, { new: true }).populate(
      'residentId',
      'name email'
    );
  },
};

/**
 * Notice operations
 */
export const NoticeOps = {
  async findById(id: string): Promise<INotice | null> {
    await ensureConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Notice.findById(id).populate('postedBy', 'name email role');
  },

  async findAll(filters?: Record<string, any>): Promise<INotice[]> {
    await ensureConnection();
    return Notice.find(filters || {})
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email role');
  },

  async findByCategory(category: string): Promise<INotice[]> {
    await ensureConnection();
    return Notice.find({ category })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email role');
  },

  async create(data: Partial<INotice>): Promise<INotice> {
    await ensureConnection();
    return Notice.create(data);
  },

  async updateById(id: string, data: Partial<INotice>): Promise<INotice | null> {
    await ensureConnection();
    return Notice.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('postedBy', 'name email role');
  },

  async deleteById(id: string): Promise<void> {
    await ensureConnection();
    await Notice.findByIdAndDelete(id);
  },
};

/**
 * Residence Settings operations
 */
export const ResidenceSettingsOps = {
  async getSettings(): Promise<IResidenceSettings | null> {
    await ensureConnection();
    return ResidenceSettings.findOne();
  },

  async updateSettings(data: Partial<IResidenceSettings>): Promise<IResidenceSettings | null> {
    await ensureConnection();
    const existing = await ResidenceSettings.findOne();
    if (!existing) {
      return ResidenceSettings.create(data);
    }
    return ResidenceSettings.findByIdAndUpdate(existing._id, data, {
      new: true,
      runValidators: true,
    });
  },
};
