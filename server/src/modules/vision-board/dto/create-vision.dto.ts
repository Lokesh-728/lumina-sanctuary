import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VisionCategory } from '@prisma/client';

export class CreateVisionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsEnum(VisionCategory)
  category: VisionCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isQuoteCard?: boolean;

  @IsNumber()
  @IsOptional()
  progressPercentage?: number;
}
