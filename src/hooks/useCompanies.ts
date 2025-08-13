import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { Company, ApiResponse } from "@/types";

interface CompaniesFilters {
  page?: number;
  limit?: number;
  active?: boolean;
  search?: string;
  segment?: string;
}

export const useCompanies = (filters: CompaniesFilters = {}) => {
  return useQuery({
    queryKey: ["companies", filters],
    queryFn: async () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      const response = await apiClient.get<ApiResponse<Company[]>>(
        "/companies",
        cleanFilters
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
