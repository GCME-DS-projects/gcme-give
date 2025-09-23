import { Strategy } from "./strategies";

export type ProjectStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';



export type Project = {
  id: string;
  title: string; 
  slug: string;
  description: string;
  shortDescription: string;
  image?: string;
  fundingGoal: number;
  fundingRaised: number;
  status: ProjectStatus;
  category: string;
  location: string;
  duration: string;
  teamSize?: string;
  problem: string;
  solution: string;
  impact: string[];
  beneficiaries: string;
  urgency: string;
  urgencyFactors: string[];
  strategyId?: string;
  Strategy?: Strategy; 
  timeLine?: any; 
  testimonials?: any; 
};