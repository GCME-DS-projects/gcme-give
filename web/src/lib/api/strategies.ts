import { Strategy } from "../types";
import { apiClient } from './base';

class StrategiesApiService {
  async getStrategies(): Promise<Strategy[]> {
    return apiClient.get<Strategy[]>('/strategies');
  }

  async getStrategy(id: string): Promise<Strategy> {
    return apiClient.get<Strategy>(`/strategies/${id}`);
  }

  async createStrategy(data: Partial<Strategy>): Promise<Strategy> {
    return apiClient.post<Strategy>('/strategies', data);
  }

  async updateStrategy(id: string, data: Partial<Strategy>): Promise<Strategy> {
    return apiClient.put<Strategy>(`/strategies/${id}`, data);
  }

  async deleteStrategy(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/strategies/${id}`);
  }

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiClient.upload<{ imageUrl: string }>('/strategies/upload/image', formData);
  }
}

export const strategiesApi = new StrategiesApiService();