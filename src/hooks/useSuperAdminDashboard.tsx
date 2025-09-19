import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { useTenantStore } from "@/store/tenantStore";
import type { ITenant, PaginatedResponse, User } from "@/types";
import type {
  SuperAdminActivity,
  SuperAdminDashboardStats,
} from "@/types/SuperAdmin";

// Hook to get super admin dashboard statistics
export const useSuperAdminStats = () => {
  const { isSuperAdmin } = useTenantStore();

  return useQuery({
    queryKey: ["super-admin-stats"],
    queryFn: async () => {
      // Get data from multiple endpoints to build super admin stats
      const [tenantsResponse, usersResponse] = await Promise.all([
        apiClient.get<PaginatedResponse<ITenant>>("/companies/tenants"),
        apiClient.get<PaginatedResponse<User>>("/users", {
          limit: "1",
        }),
      ]);

      // Extract data with proper typing
      const tenants = tenantsResponse.data || [];
      const activeTenants = tenants.filter((t) => t.active).length;

      const totalUsers = usersResponse.pagination?.total || 0;

      // Mock other data that would come from dedicated backend stats endpoint
      // In real implementation, you'd have a /admin/stats endpoint
      return {
        totalTenants: tenants.length,
        activeTenants: activeTenants,
        totalUsers: totalUsers,
        totalProjects: 0, // Would come from projects endpoint when implemented
        activeProjects: 0, // Would come from projects endpoint when implemented
        monthlyRevenue: 0, // Would come from billing/revenue endpoint when implemented
        revenueGrowth: 0,
        userGrowth: 0,
        tenantGrowth: 0,
      } as SuperAdminDashboardStats;
    },
    enabled: isSuperAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook to get super admin recent activities
export const useSuperAdminTimeline = () => {
  const { isSuperAdmin } = useTenantStore();

  return useQuery({
    queryKey: ["super-admin-timeline"],
    queryFn: async () => {
      // Get recent tenants and users to build activity timeline
      const [tenantsResponse, usersResponse] = await Promise.all([
        apiClient.get<PaginatedResponse<ITenant>>("/companies/tenants", {
          limit: "5",
          page: "1",
        }),
        apiClient.get<PaginatedResponse<User>>("/users", {
          limit: "5",
          page: "1",
        }),
      ]);

      const activities: SuperAdminActivity[] = [];

      // Convert tenants to activities
      const tenants = tenantsResponse.data || [];
      tenants.forEach((tenant) => {
        activities.push({
          id: `tenant-${tenant.id}`,
          type: "tenant_created",
          description: `Nova empresa cadastrada: ${tenant.name}`,
          timestamp: tenant.createdAt,
          tenantName: tenant.name,
        });
      });

      // Convert users to activities
      const users = usersResponse.data || [];
      users.forEach((user) => {
        activities.push({
          id: `user-${user.id}`,
          type: "user_registered",
          description: `Novo usuário registrado: ${user.name}`,
          timestamp: user.createdAt,
          userName: user.name,
          tenantName: user.tenantCompanyId ? "Empresa associada" : undefined,
        });
      });

      // Sort by timestamp descending (most recent first)
      return activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    enabled: isSuperAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

// Hook to get tenant companies count for super admin
export const useSuperAdminTenantsCount = () => {
  const { isSuperAdmin } = useTenantStore();

  return useQuery({
    queryKey: ["super-admin-tenants-count"],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<ITenant>>(
        "/companies/tenants",
        {
          limit: "1", // Just to get total count from pagination
        }
      );

      return {
        total: response.pagination?.total || 0,
        active: response.data?.filter((t) => t.active).length || 0,
      };
    },
    enabled: isSuperAdmin,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
