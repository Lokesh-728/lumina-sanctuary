import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  primaryLocation?: string;

  @IsString()
  @IsOptional()
  atmosphereVibes?: string;

  @IsString()
  @IsOptional()
  morningDiscipline?: string;

  @IsString()
  @IsOptional()
  wealthConsciousness?: string;

  @IsString()
  @IsOptional()
  quote?: string;
}
