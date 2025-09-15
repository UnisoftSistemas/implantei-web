// MULTI-TENANT: Updated Firebase User interface with tenant support
export interface IFirebaseUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: string;
  tenantCompanyId?: string | null; // Multi-tenant support
}

// MULTI-TENANT: Tenant-specific interfaces
export interface ITenant {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  segment?: string;
  contactPerson?: string;
  active: boolean;
  isTenant: boolean;
  userCount?: number; // Display purposes
  projectCount?: number; // Display purposes
  createdAt: Date;
  updatedAt: Date;
}

// MULTI-TENANT: Enhanced user with tenant data
export interface ITenantUser extends IFirebaseUser {
  tenant?: ITenant;
}
