import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { User, ApiResponse } from "@/types";
import type { CreateUserFormData, UpdateUserFormData } from "@/schemas/user";

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserFormData) => {
      const response = await apiClient.post<ApiResponse<User>>(
        "/users",
        userData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Also invalidate tenant queries if user count might change
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error) => {
      console.error("Create user error:", error);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserFormData;
    }) => {
      const response = await apiClient.put<ApiResponse<User>>(
        `/users/${id}`,
        userData
      );
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Update specific user cache
      queryClient.setQueryData(["user", updatedUser.id], updatedUser);
    },
    onError: (error) => {
      console.error("Update user error:", error);
    },
  });
};

// Toggle user active status mutation
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.put<ApiResponse<User>>(
        `/users/${userId}/toggle-status`
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate users queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Toggle user status error:", error);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete<
        ApiResponse<{ deleted: boolean }>
      >(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Also invalidate tenant queries if user count might change
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error) => {
      console.error("Delete user error:", error);
    },
  });
};

// Reset user password mutation
export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
    }: {
      userId: string;
      newPassword: string;
    }) => {
      const response = await apiClient.put<ApiResponse<{ success: boolean }>>(
        `/users/${userId}/reset-password`,
        { password: newPassword }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Reset password error:", error);
    },
  });
};
