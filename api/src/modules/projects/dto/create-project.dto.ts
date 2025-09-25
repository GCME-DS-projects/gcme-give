import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  teamSize?: string;

  @IsOptional()
  @IsString()
  fundingGoal?: string;

  @IsOptional()
  @IsString()
  fundingRaised?: string;

  @IsOptional()
  @IsString()
  beneficiaries?: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  urgency?: string;

  @IsOptional()
  @IsArray()
  urgencyFactors?: string[];

  @IsOptional()
  @IsArray()
  impact?: string[];

  @IsOptional()
  timeLine?: any;

  @IsOptional()
  testimonials?: any;

  @IsString()
  strategyId: string;
}
