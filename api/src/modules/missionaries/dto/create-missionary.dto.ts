import { IsOptional, IsString, IsBoolean, IsArray, IsInt, IsUUID } from 'class-validator';

export class CreateMissionaryDto {
  @IsUUID()
  userId: string;

  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() shortBio?: string;
  @IsOptional() @IsString() fullBio?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() qualification?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() experience?: string;
  @IsOptional() @IsString() years?: string;
  @IsOptional() @IsString() mission?: string;
  @IsOptional() @IsString() focus?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsArray() prayerRequests?: string[];
  @IsOptional() recentUpdates?: any;
  @IsOptional() supportNeeds?: any;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsUUID() strategyId?: string;
  @IsOptional() @IsInt() livesImpacted?: number;
  @IsOptional() @IsInt() communitiesServed?: number;
  @IsOptional() @IsInt() projectsCompleted?: number;
  @IsOptional() @IsBoolean() isDeleted?: boolean;
  @IsOptional() @IsString() staffId?: string;
  @IsOptional() @IsString() parentRc?: string;
  @IsOptional() @IsString() rcAccount?: string;
  @IsOptional() @IsString() designationNumber?: string;
  @IsOptional() @IsString() region?: string;
}
