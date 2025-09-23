export type Strategy = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  slug: string;
  icon?: string;
  imagePath?: string; 
  activities: string[];
  visionText?: string;
  involvedText?: string;
  impactQuote?: string;
  isDeleted: boolean;
};