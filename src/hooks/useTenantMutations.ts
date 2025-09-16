import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { ApiResponse, ITenant } from "@/types";
import type { TenantFormData } from "@/components/Forms/TenantForm";

// Create tenant mutation
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TenantFormData): Promise<ITenant> => {
      const response = await apiClient.post<ApiResponse<ITenant>>(
        "/companies",
        {
          ...data,
          isTenant: true, // Always true for tenant creation
        }
      );
      return response.data;
    },
    onSuccess: (newTenant) => {
      // Invalidate ALL related queries
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["available-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-stats"] }); // Dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // Regular dashboard
      queryClient.invalidateQueries({ queryKey: ["companies"] }); // Companies list

      // Add to cache optimistically
      queryClient.setQueryData(
        ["tenants"],
        (oldData: { data: ITenant[]; pagination: { total: number } }) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [newTenant, ...oldData.data],
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total + 1,
            },
          };
        }
      );

      console.log("✅ Tenant created successfully:", newTenant);
    },
    onError: (error) => {
      console.error("Error creating tenant:", error);
    },
  });
};

// Update tenant mutation
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TenantFormData>;
    }): Promise<ITenant> => {
      const response = await apiClient.put<ApiResponse<ITenant>>(
        `/companies/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (updatedTenant) => {
      // Invalidate ALL related queries
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["available-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", updatedTenant.id] });

      // Update cache optimistically
      queryClient.setQueryData(["tenants"], (oldData: { data: ITenant[] }) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((tenant: ITenant) =>
            tenant.id === updatedTenant.id ? updatedTenant : tenant
          ),
        };
      });

      console.log("✅ Tenant updated successfully:", updatedTenant);
    },
    onError: (error) => {
      console.error("Error updating tenant:", error);
    },
  });
};

// Toggle tenant status mutation
export const useToggleTenantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      active,
    }: {
      id: string;
      active: boolean;
    }): Promise<ITenant> => {
      const response = await apiClient.put<ApiResponse<ITenant>>(
        `/companies/${id}`,
        {
          active,
        }
      );
      return response.data;
    },
    onSuccess: (updatedTenant) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["available-tenants"] });

      // Update cache optimistically
      queryClient.setQueryData(["tenants"], (oldData: { data: ITenant[] }) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((tenant: ITenant) =>
            tenant.id === updatedTenant.id ? updatedTenant : tenant
          ),
        };
      });
    },
    onError: (error) => {
      console.error("Error toggling tenant status:", error);
    },
  });
};

// Delete tenant mutation (soft delete)
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/companies/${id}`);
    },
    onSuccess: (_, deletedId) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["available-tenants"] });

      // Remove from cache optimistically
      queryClient.setQueryData(
        ["tenants"],
        (oldData: { data: ITenant[]; pagination: { total: number } }) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter(
              (tenant: ITenant) => tenant.id !== deletedId
            ),
            pagination: {
              ...oldData.pagination,
              total: Math.max(0, oldData.pagination.total - 1),
            },
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error deleting tenant:", error);
    },
  });
};

// Get single tenant details
export const useGetTenant = (id: string) => {
  return useMutation({
    mutationFn: async (): Promise<ITenant> => {
      const response = await apiClient.get<ApiResponse<ITenant>>(
        `/companies/${id}`
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Error fetching tenant details:", error);
    },
  });
};
