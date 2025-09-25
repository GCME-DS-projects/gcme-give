'use client';
import { apiClient } from './base';
import { Missionary, CreateMissionaryDto, QueryMissionaryDto, DeleteResponse } from '../types';

class MissionariesApiService {
  async getMissionaries(query?: QueryMissionaryDto): Promise<Missionary[]> {
    const queryString = query
      ? '?' + new URLSearchParams(
          Object.entries(query).filter(([v]) => v !== undefined) as [string, string][]
        ).toString()
      : '';
    return apiClient.get<Missionary[]>(`/missionaries${queryString}`);
  }

  async getMissionary(id: string): Promise<Missionary> {
    return apiClient.get<Missionary>(`/missionaries/${id}`);
  }

  async createMissionary(data: CreateMissionaryDto): Promise<Missionary> {
    return apiClient.post<Missionary>('/missionaries', data);
  }

  async updateMissionary(id: string, data: Partial<CreateMissionaryDto>): Promise<Missionary> {
    return apiClient.put<Missionary>(`/missionaries/${id}`, data);
  }

  async removeMissionary(id: string): Promise<DeleteResponse> {
    return apiClient.delete<DeleteResponse>(`/missionaries/${id}`);
  }

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiClient.upload<{ imageUrl: string }>('/missionaries/upload/image', formData);
  }
}

export const missionariesApi = new MissionariesApiService();
