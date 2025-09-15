import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";
import { apiClient } from "@/services/api";
import type { ApiResponse, ITenant } from "@/types";

export const useTenantAuth = () => {
  const { user } = useAuthStore();
  const { setIsSuperAdmin, setCurrentTenant, setAvailableTenants, setLoading } =
    useTenantStore();

  // Check if user is super admin
  const isSuperAdmin = user?.role === "super_admin" || !user?.tenantCompanyId;

  // Fetch current tenant data for non-super admin users
  const { data: currentTenantData } = useQuery({
    queryKey: ["current-tenant", user?.tenantCompanyId],
    queryFn: async () => {
      if (!user?.tenantCompanyId) return null;

      const response = await apiClient.get<ApiResponse<ITenant>>(
        `/companies/${user.tenantCompanyId}`
      );
      return response.data;
    },
    enabled: !!user?.tenantCompanyId && !isSuperAdmin,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Fetch available tenants for super admin
  const { data: tenantsData } = useQuery({
    queryKey: ["available-tenants"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ITenant[]>>(
        "/companies/tenants"
      );
      return response.data;
    },
    enabled: isSuperAdmin,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Update tenant store when user changes
  useEffect(() => {
    if (!user) {
      setIsSuperAdmin(false);
      setCurrentTenant(null);
      setAvailableTenants([]);
      return;
    }

    setLoading(true);
    setIsSuperAdmin(isSuperAdmin);

    if (isSuperAdmin) {
      // Super admin: set available tenants list
      if (tenantsData) {
        setAvailableTenants(tenantsData);
      }
      setCurrentTenant(null); // Start with global view
    } else {
      // Regular user: set current tenant
      if (currentTenantData) {
        setCurrentTenant(currentTenantData);
      }
      setAvailableTenants([]);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSuperAdmin, currentTenantData, tenantsData]);

  return {
    isSuperAdmin,
    isLoading: useTenantStore((state) => state.isLoading),
    currentTenant: useTenantStore((state) => state.currentTenant),
    availableTenants: useTenantStore((state) => state.availableTenants),
  };
};
