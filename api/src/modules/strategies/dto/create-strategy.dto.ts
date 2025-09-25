import { IsString, IsOptional } from 'class-validator';

export class CreateStrategyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsString()
  slug: string;

  @IsString()
  fullDescription: string;

  @IsString()
  impactQuote: string;

  @IsString()
  involvedText: string;

  @IsString()
  visionText: string;

  @IsOptional()
  activities?: string[];
}
