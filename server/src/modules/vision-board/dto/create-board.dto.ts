import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VisionCategory, BoardLayoutMode } from '@prisma/client';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsEnum(VisionCategory)
  @IsOptional()
  category?: VisionCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(BoardLayoutMode)
  @IsOptional()
  layoutMode?: BoardLayoutMode;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}
