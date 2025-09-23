// Define the shape of a single support need object
export interface SupportNeed {
  item: string;
  amount: number;
  description?: string;
}

export interface Missionary {
  id: string;
  userId: string;
  title?: string;
  phone?: string;
  shortBio?: string;
  fullBio?: string;
  imageUrl?: string;
  email?: string;
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
  supportNeeds?: SupportNeed[]; // FIX: Changed from 'any' to 'SupportNeed[]'
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
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// --- DTOs remain the same ---

export interface CreateMissionaryDto {
  imageUrl?: string;
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
  staffId?: string;
  parentRc?: string;
  rcAccount?: string;
  designationNumber?: string;
  region?: string;
}

export interface UpdateMissionaryDto extends Partial<CreateMissionaryDto> {}

export interface QueryMissionaryDto {
  search?: string;
  status?: string;
  type?: string;
  role?: string;
  region?: string;
}

export interface DeleteResponse {
  success: boolean;
}