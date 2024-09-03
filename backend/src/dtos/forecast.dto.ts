import { IsNullable } from '@/utils/custom-validation-classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class setForecastDto {
  @IsString()
  pupilId: string;
  @IsString()
  groupId: string;
  @IsNullable()
  @IsOptional()
  @IsString()
  period: string | null;
  @IsNumber()
  schoolYear: number;
  @IsNumber()
  forecast: number;
}

export class copyPreviousForecastDto {
  @IsString()
  groupId: string;
  @IsNullable()
  @IsOptional()
  @IsString()
  period?: string | null;
  @IsNullable()
  @IsOptional()
  @IsString()
  previusPeriod?: string | null;
  @IsNumber()
  /** @format int32 */
  schoolYear: number;
  @IsNumber()
  /** @format int32 */
  previusSchoolYear: number;
}
