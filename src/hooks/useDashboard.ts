import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type {
  Activity,
  DashboardStats,
  Project,
  Task,
  ApiResponse,
} from "@/types";

// Hook to get dashboard statistics
export const useDashboardStats = () => {
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
  });
};

// Hook to get projects kanban view
export const useDashboardProjects = () => {
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
  });
};

// Hook to get user's tasks
export const useDashboardTasks = () => {
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
  });
};

// Hook to get timeline activities
export const useDashboardTimeline = () => {
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
  });
};
