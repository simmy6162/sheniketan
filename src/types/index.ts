export type UserRole = "ADMIN" | "RESIDENT";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
};
