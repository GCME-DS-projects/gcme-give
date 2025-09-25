import { ProjectsApi } from "@/lib/api/projects";
import { Project } from "@/lib/types/projects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const projectsQueryKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsQueryKeys.all, "list"] as const,
};

export const useGetProjects = () =>
  useQuery({
    queryKey: projectsQueryKeys.lists(),
    queryFn: () => ProjectsApi.getProjects(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      if (typeof error === "object" && error !== null && "status" in error) {
        const status = (error as { status?: number }).status;
        return status !== 401 && failureCount < 2;
      }
      return failureCount < 2;
    },
  });

export const useGetProject = (id: string) =>
  useQuery({
    queryKey: [...projectsQueryKeys.all, id],
    queryFn: () => ProjectsApi.getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      if (typeof error === "object" && error !== null && "status" in error) {
        const status = (error as { status?: number }).status;
        return status !== 401 && failureCount < 2;
      }
      return failureCount < 2;
    },
  });

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) => ProjectsApi.createProject(data),
    onSuccess: (createdProject: Project) => {
      queryClient.setQueryData<Project[]>(
        projectsQueryKeys.lists(),
        (oldData) => (oldData ? [...oldData, createdProject] : [createdProject])
      );
      toast.success("Project created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error creating project");
    },
  });
};

export const useUpdateProjectMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Project>) => ProjectsApi.updateProject(id, data),
    onSuccess: (updatedProject: Project) => {
      queryClient.setQueryData<Project[]>(
        projectsQueryKeys.lists(),
        (oldData) =>
          oldData
            ? oldData.map((project) =>
                project.id === id ? updatedProject : project
              )
            : [updatedProject]
      );
      toast.success("Project updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error updating project");
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProjectsApi.deleteProject(id),
    onSuccess: (_data, id: string) => {
      queryClient.setQueryData<Project[]>(
        projectsQueryKeys.lists(),
        (oldData) => (oldData ? oldData.filter((p) => p.id !== id) : [])
      );
      toast.success("Project deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error deleting project");
    },
  });
};

