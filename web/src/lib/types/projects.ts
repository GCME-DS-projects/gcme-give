import { Strategy } from "./strategies";

export type ProjectStatus = "UPCOMING" | "ACTIVE" | "COMPLETED";

export interface TimelineEntry {
  status: "completed" | "in-progress" | "upcoming";
  phase: string;
  duration: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}


export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image?: string;
  fundingGoal: string;
  fundingRaised: string;
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
  timeLine?: TimelineEntry[];
  testimonials?: Testimonial[]; 
};
