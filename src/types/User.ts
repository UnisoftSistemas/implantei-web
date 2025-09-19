import type { UserRole } from "./Enums";

// MULTI-TENANT: Updated User interface with tenantCompanyId
export interface User {
  id: string;
  name: string;
  email: string;
  firebaseUid: string;
  phone?: string;
  role: UserRole;
  profileImageUrl?: string;
  active: boolean;
  tenantCompanyId?: string | null; // Multi-tenant support
  createdAt: Date;
  updatedAt: Date;
}

// MULTI-TENANT: Updated UserProfile with tenant info
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImageUrl?: string;
  active: boolean;
  tenantCompanyId?: string | null; // Multi-tenant support
}

// Auth related interfaces - keeping existing structure
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
