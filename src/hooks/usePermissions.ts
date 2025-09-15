import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";

export const usePermissions = () => {
  const { user } = useAuthStore();
  const { isSuperAdmin, currentTenant } = useTenantStore();

  // Core permission checks
  const canManageTenants = isSuperAdmin;

  const canManageUsers = ["super_admin", "admin", "manager"].includes(
    user?.role || ""
  );

  const canCreateCompanies = ["super_admin", "admin", "manager"].includes(
    user?.role || ""
  );

  const canViewAllData = isSuperAdmin;

  const canManageProjects = [
    "super_admin",
    "admin",
    "manager",
    "consultant",
  ].includes(user?.role || "");

  const canAssignTasks = [
    "super_admin",
    "admin",
    "manager",
    "consultant",
  ].includes(user?.role || "");

  const canAccessDashboard = [
    "admin",
    "manager",
    "consultant",
    "technician",
  ].includes(user?.role || "");

  // Tenant-specific permission checks
  const canAccessTenant = (tenantId: string): boolean => {
    // Super admin can access any tenant
    if (isSuperAdmin) return true;

    // Regular user can only access their own tenant
    return user?.tenantCompanyId === tenantId;
  };

  const canModifyTenantData = (tenantId?: string): boolean => {
    // Super admin can modify any tenant data
    if (isSuperAdmin) return true;

    // User must be admin/manager and belong to the tenant
    if (!["admin", "manager"].includes(user?.role || "")) return false;

    // If no tenantId provided, check current tenant
    const targetTenantId = tenantId || currentTenant?.id;
    return user?.tenantCompanyId === targetTenantId;
  };

  const canSwitchTenants = (): boolean => {
    return isSuperAdmin;
  };

  // Role-based checks
  const isAdmin = user?.role === "admin" || isSuperAdmin;
  const isManager = user?.role === "manager" || isAdmin;
  const isConsultant = user?.role === "consultant" || isManager;
  const isTechnician = user?.role === "technician";
  const isClient = user?.role === "client";

  return {
    // Core permissions
    canManageTenants,
    canManageUsers,
    canCreateCompanies,
    canViewAllData,
    canManageProjects,
    canAssignTasks,
    canAccessDashboard,

    // Tenant permissions
    canAccessTenant,
    canModifyTenantData,
    canSwitchTenants,

    // Role checks
    isAdmin,
    isManager,
    isConsultant,
    isTechnician,
    isClient,
    isSuperAdmin,

    // Current user info
    userRole: user?.role,
    tenantId: user?.tenantCompanyId,
    currentTenantId: currentTenant?.id,
  };
};
