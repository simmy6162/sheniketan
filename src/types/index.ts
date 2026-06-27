/** User roles across She Niketan platform */
export type UserRole = 'member' | 'warden' | 'admin';
export type Occupation = 'Student' | 'Working' | 'Intern' | 'Exam Prep';
export type PreferredRoomType = 'Single' | 'Shared';
export type AllocationStatus = 'Pending' | 'Allocated' | 'Waitlisted' | 'None';

export interface User {
  _id?: string;
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

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  exp?: number;
}

export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}
