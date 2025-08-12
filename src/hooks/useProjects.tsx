import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import type { Project, ApiResponse } from "@/types";

interface ProjectsFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  consultantId?: string;
  managerId?: string;
  companyId?: string;
  systemId?: string;
  search?: string;
}

// Hook to get projects with filters
export const useProjects = (filters: ProjectsFilters = {}) => {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: async () => {
      // Clean undefined values from filters
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      const response = await apiClient.get<ApiResponse<Project[]>>(
        "/projects",
        cleanFilters
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: true, // Always enabled, filters are handled by queryKey
  });
};

// Hook to get single project
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Project>>(
        `/projects/${projectId}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!projectId,
  });
};

// Hook to create new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      const response = await apiClient.post<ApiResponse<Project>>(
        "/projects",
        projectData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate projects queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
    },
  });
};

// Hook to update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Project>;
    }) => {
      const response = await apiClient.put<ApiResponse<Project>>(
        `/projects/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (updatedProject) => {
      // Update specific project in cache
      queryClient.setQueryData(["project", updatedProject.id], updatedProject);

      // Invalidate projects list to refresh
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
    },
    onError: (error) => {
      console.error("Error updating project:", error);
    },
  });
};

// Hook to delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      await apiClient.delete(`/projects/${projectId}`);
      return projectId;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["project", deletedId] });

      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
    },
  });
};

// Hook to get project stages
export const useProjectStages = (projectId: string) => {
  return useQuery({
    queryKey: ["project-stages", projectId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<unknown[]>>(
        `/projects/${projectId}/stages`
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: !!projectId,
  });
};

// Hook to initialize project stages from template
export const useInitializeProjectStages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      templateId,
    }: {
      projectId: string;
      templateId: string;
    }) => {
      const response = await apiClient.post(
        `/projects/${projectId}/initialize-stages`,
        {
          templateId,
        }
      );
      return response;
    },
    onSuccess: (_, { projectId }) => {
      // Invalidate project stages to refresh
      queryClient.invalidateQueries({
        queryKey: ["project-stages", projectId],
      });
    },
    onError: (error) => {
      console.error("Error initializing project stages:", error);
    },
  });
};
