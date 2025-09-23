import { Project } from "../types/projects";
import { apiClient } from "./base";

class ProjectsAPI {
  async getProjects(): Promise<Project[]> {
    return apiClient.get<Project[]>("/projects");
  }

  async getProject(id: string): Promise<Project> {
    return apiClient.get<Project>(`/projects/${id}`);
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    return apiClient.post<Project>("/projects", data);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return apiClient.put<Project>(`/projects/${id}`, data);
  }

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/projects/${id}`);
  }

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.upload<{ imageUrl: string }>(
      "/projects/upload/image",
      formData
    );
  }
}

export const ProjectsApi = new ProjectsAPI();
