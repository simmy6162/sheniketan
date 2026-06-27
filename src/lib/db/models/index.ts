/**
 * Central export point for all Mongoose models
 * Use these for database operations throughout the application
 */

export { User, type IUser, type UserRole, type Occupation, type PreferredRoomType, type AllocationStatus } from './User';
export { Room, type IRoom, type RoomType, type RoomStatus } from './Room';
export { Complaint, type IComplaint, type ComplaintCategory, type ComplaintStatus } from './Complaint';
export {
  LeaveRequest,
  type ILeaveRequest,
  type LeaveType,
  type LeaveStatus,
} from './LeaveRequest';
export { Notice, type INotice, type NoticeCategory } from './Notice';
export {
  ResidenceSettings,
  type IResidenceSettings,
} from './ResidenceSettings';
