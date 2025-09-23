export interface SupportNeed {
  item: string;
  amount: number | string;
  progress: number | string;
  description: string;
}

export interface Missionary {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  years: number;
  focus: string;
  type: 'Full-time' | 'Part-time';
  strategy: string;
  strategyId?: string;
  status: 'Active' | 'Inactive';
  image?: string;
  shortBio: string;
  fullBio?: string;
  mission?: string;
  prayerRequests?: string[];
  recentUpdates?: { date: string; title: string; content: string }[];
  supportNeeds?: SupportNeed[];
  website?: string;
}

export interface Strategy {
  id: string;
  title: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}