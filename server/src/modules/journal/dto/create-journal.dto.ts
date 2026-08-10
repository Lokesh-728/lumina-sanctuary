import { IsArray, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateJournalDto {
  @IsString()
  @MinLength(1, { message: 'Title is required' })
  title: string;

  @IsString()
  @MinLength(1, { message: 'Journal content is required' })
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  mood?: string;

  @IsUrl({}, { message: 'Image URL must be valid' })
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  prompt?: string;
}
