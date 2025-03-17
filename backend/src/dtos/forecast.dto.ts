import { IsNumber, IsOptional, IsString } from 'class-validator';
export class setForecastDto {
  @IsString()
  pupilId: string;
  @IsString()
  groupId: string;
  @IsNumber()
  forecast: number;
  @IsOptional()
  @IsString()
  syllabusId: string;
}

export class copyPreviousForecastDto {
  @IsString()
  groupId: string;
  @IsOptional()
  @IsString()
  syllabusId: string;
}
