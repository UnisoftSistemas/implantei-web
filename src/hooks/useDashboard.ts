import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type {
  Activity,
  DashboardStats,
  Project,
  Task,
  ApiResponse,
} from "@/types";
import { useTenantStore } from "@/store/tenantStore";
import type {
  SuperAdminActivity,
  SuperAdminDashboardStats,
} from "@/types/SuperAdmin";

// Hook to get dashboard statistics
export const useDashboardStats = () => {
  const { isSuperAdmin } = useTenantStore();
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DashboardStats>>(
        "/dashboard/stats"
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - stats can be cached
    refetchOnWindowFocus: false,
    enabled: !isSuperAdmin,
  });
};

// Hook to get projects kanban view
export const useDashboardProjects = () => {
  const { isSuperAdmin } = useTenantStore();
  return useQuery({
    queryKey: ["dashboard-projects"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Project[]>>(
        "/dashboard/projects/kanban",
        {
          limit: "10",
        }
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: !isSuperAdmin,
  });
};

// Hook to get user's tasks
export const useDashboardTasks = () => {
  const { isSuperAdmin } = useTenantStore();
  return useQuery({
    queryKey: ["dashboard-tasks"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Task[]>>(
        "/dashboard/tasks/my",
        {
          limit: "8",
          status: "todo,in_progress",
        }
      );
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: !isSuperAdmin,
  });
};

// Hook to get timeline activities
export const useDashboardTimeline = () => {
  const { isSuperAdmin } = useTenantStore();
  return useQuery({
    queryKey: ["dashboard-timeline"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Activity[]>>(
        "/dashboard/timeline",
        {
          limit: "10",
        }
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: !isSuperAdmin,
  });
};

export const useSuperAdminStats = () => {
  const { isSuperAdmin } = useTenantStore();

  return useQuery({
    queryKey: ["super-admin-stats"],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<SuperAdminDashboardStats>
      >("/dashboard/stats");
      return response.data;
    },
    enabled: isSuperAdmin,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useSuperAdminTimeline = () => {
  const { isSuperAdmin } = useTenantStore();

  return useQuery({
    queryKey: ["super-admin-timeline"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<SuperAdminActivity[]>>(
        "/dashboard/timeline"
      );
      return response.data;
    },
    enabled: isSuperAdmin,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};
