import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { System, ApiResponse } from "@/types";

interface SystemsFilters {
  page?: number;
  limit?: number;
  active?: boolean;
  search?: string;
  category?: string;
}

export const useSystems = (filters: SystemsFilters = {}) => {
  return useQuery({
    queryKey: ["systems", filters],
    queryFn: async () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      const response = await apiClient.get<ApiResponse<System[]>>(
        "/systems",
        cleanFilters
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
