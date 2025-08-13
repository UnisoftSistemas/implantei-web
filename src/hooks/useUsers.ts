import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { User, ApiResponse, UserRole } from "@/types";

interface UsersFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  active?: boolean;
  search?: string;
}

export const useUsers = (filters: UsersFilters = {}) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      const response = await apiClient.get<ApiResponse<User[]>>(
        "/users",
        cleanFilters
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
