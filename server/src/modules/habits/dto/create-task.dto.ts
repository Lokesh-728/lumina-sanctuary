import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { TaskCategory, TaskPriority, RepeatFrequency } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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
}
