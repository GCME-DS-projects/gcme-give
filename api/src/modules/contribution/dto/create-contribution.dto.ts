import { IsUUID, IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { PAYMENT_METHOD } from '@prisma/client';

export class CreateContributionDto {
  @IsNumber()
  amount: number;

  @IsUUID()
  contributorId: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  missionaryId?: string;

  @IsOptional()
  @IsUUID()
  strategyId?: string;

  @IsOptional()
  @IsEnum(PAYMENT_METHOD)
  paymentMethod?: PAYMENT_METHOD;

  @IsOptional()
  @IsString()
  status?: string; // e.g., PENDING, SUCCESS
}
