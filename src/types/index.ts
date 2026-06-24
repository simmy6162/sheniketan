/** User roles across She Niketan platform */
export type UserRole = 'member' | 'warden' | 'admin';

export interface User {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  roomNumber?: string;
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
