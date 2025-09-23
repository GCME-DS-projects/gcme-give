import { IsOptional, IsString } from 'class-validator';

export class QueryMissionaryDto {
    @IsOptional() 
    @IsString() 
    search?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    region?: string;
}