import type { UserRole } from "./Enums";

export interface User {
  id: string;
  name: string;
  email: string;
  firebaseUid: string;
  phone?: string;
  role: UserRole;
  profileImageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImageUrl?: string;
  active: boolean;
}

// Auth related interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}
