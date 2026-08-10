import { IsEnum, IsOptional, IsString, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { TaskCategory, TaskPriority, RepeatFrequency } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsInt()
  @IsOptional()
  estimatedTime?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(RepeatFrequency)
  @IsOptional()
  repeatFrequency?: RepeatFrequency;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
