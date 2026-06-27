/**
 * Database layer for She Niketan
 * 
 * This module provides Mongoose connection and all data models.
 * 
 * Usage:
 * ```
 * import { connectMongoose } from '@/lib/db';
 * import { User, Room, Complaint, type IUser } from '@/lib/db';
 * 
 * await connectMongoose();
 * const user = await User.findById(userId);
 * ```
 */

export { connectMongoose } from './mongoose';

// Re-export all models and types
export {
  User,
  type IUser,
  type UserRole,
  type Occupation,
  type PreferredRoomType,
  type AllocationStatus,
  Room,
  type IRoom,
  type RoomType,
  type RoomStatus,
  Complaint,
  type IComplaint,
  type ComplaintCategory,
  type ComplaintStatus,
  LeaveRequest,
  type ILeaveRequest,
  type LeaveType,
  type LeaveStatus,
  Notice,
  type INotice,
  type NoticeCategory,
  ResidenceSettings,
  type IResidenceSettings,
} from './models';

// Re-export database utilities
export { UserOps, RoomOps, ComplaintOps, LeaveRequestOps, NoticeOps, ResidenceSettingsOps } from './utils';

// Re-export helpers
export {
  createResponse,
  createErrorResponse,
  createSuccessResponse,
  isValidObjectId,
  toObjectId,
  handleDatabaseError,
  type IApiResponse,
} from './helpers';
