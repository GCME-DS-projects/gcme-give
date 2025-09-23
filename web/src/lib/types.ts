export interface SupportNeed {
  item: string;
  amount: number | string;
  progress: number | string;
  description: string;
}

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
  user: User;
  // Computed properties for display
  name?: string;
  email?: string;
  strategy?: string;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface Strategy {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Completed';
  startDate?: string;
  endDate?: string;
  budget?: number;
  missionaryId?: string;
  missionary?: Missionary;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  projectId?: string;
  project?: Project;
  missionaryId?: string;
  missionary?: Missionary;
  status: 'Pending' | 'Completed' | 'Failed';
  paymentMethod?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// DTOs for API requests
export interface CreateMissionaryDto {
  userId: string;
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

export interface UpdateMissionaryDto {
  userId?: string;
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

export interface QueryMissionaryDto {
  search?: string;
  status?: string;
  type?: string;
  role?: string;
  region?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateStrategyDto {
  title: string;
  description?: string;
}

export interface UpdateStrategyDto {
  title?: string;
  description?: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Completed';
  startDate?: string;
  endDate?: string;
  budget?: number;
  missionaryId?: string;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  status?: 'Active' | 'Inactive' | 'Completed';
  startDate?: string;
  endDate?: string;
  budget?: number;
  missionaryId?: string;
}

export interface CreateContributionDto {
  amount: number;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  projectId?: string;
  missionaryId?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface UpdateContributionDto {
  amount?: number;
  currency?: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  projectId?: string;
  missionaryId?: string;
  status?: 'Pending' | 'Completed' | 'Failed';
  paymentMethod?: string;
  notes?: string;
}

export interface DeleteResponse {
  message: string;
  id: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}
