import { apiClient } from './api-client';

export interface Missionary {
  id: string;
  userId: string;
  title?: string;
  phone?: string;
  shortBio?: string;
  fullBio?: string;
  location?: string;
  qualification?: string;
  website?: string;
  experience?: string;
  years?: string;
  mission?: string;
  focus?: string;
  status?: string;
  prayerRequests?: string[];
  recentUpdates?: any;
  supportNeeds?: any;
  type?: string;
  role?: string;
  strategyId?: string;
  livesImpacted?: number;
  communitiesServed?: number;
  projectsCompleted?: number;
  isDeleted?: boolean;
  staffId?: string;
  parentRc?: string;
  rcAccount?: string;
  designationNumber?: string;
  region?: string;
}

export interface CreateMissionaryDto {
  userId: string;
  title?: string;
  phone?: string;
  shortBio?: string;
  fullBio?: string;
  location?: string;
  qualification?: string;
  website?: string;
  experience?: string;
  years?: string;
  mission?: string;
  focus?: string;
  status?: string;
  prayerRequests?: string[];
  recentUpdates?: any;
  supportNeeds?: any;
  type?: string;
  role?: string;
  strategyId?: string;
  livesImpacted?: number;
  communitiesServed?: number;
  projectsCompleted?: number;
  isDeleted?: boolean;
  staffId?: string;
  parentRc?: string;
  rcAccount?: string;
  designationNumber?: string;
  region?: string;
}

export interface UpdateMissionaryDto extends Partial<CreateMissionaryDto> {}

export class MissionariesApiService {
  async getAllMissionaries(): Promise<Missionary[]> {
    return apiClient.get<Missionary[]>('/missionaries');
  }

  async getMissionaryById(id: string): Promise<Missionary> {
    return apiClient.get<Missionary>(`/missionaries/${id}`);
  }

  async createMissionary(data: CreateMissionaryDto): Promise<Missionary> {
    return apiClient.post<Missionary>('/missionaries', data);
  }

  async updateMissionary(id: string, data: UpdateMissionaryDto): Promise<Missionary> {
    return apiClient.patch<Missionary>(`/missionaries/${id}`, data);
  }

  async deleteMissionary(id: string): Promise<Missionary> {
    return apiClient.delete<Missionary>(`/missionaries/${id}`);
  }
}

export const missionariesApiService = new MissionariesApiService();
