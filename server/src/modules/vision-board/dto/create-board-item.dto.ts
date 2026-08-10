import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VisionItemType } from '@prisma/client';

export class CreateBoardItemDto {
  @IsString()
  boardId: string;

  @IsEnum(VisionItemType)
  itemType: VisionItemType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  linkUrl?: string;

  @IsNumber()
  @IsOptional()
  goalTarget?: number;

  @IsNumber()
  @IsOptional()
  goalProgress?: number;

  @IsString()
  @IsOptional()
  targetDate?: string;

  @IsString()
  @IsOptional()
  affirmationId?: string;

  @IsNumber()
  @IsOptional()
  posX?: number;

  @IsNumber()
  @IsOptional()
  posY?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  zIndex?: number;

  @IsString()
  @IsOptional()
  bgColor?: string;
}
