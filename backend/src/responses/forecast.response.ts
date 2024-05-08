import { IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { ForecastMyGroupTeacher, ForecastMyGroup, Pupil as _Pupil, MyMentorClassPupil as _MyMentorClassPupil } from '@/interfaces/forecast.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import ApiResponse from '@/interfaces/api-service.interface';
import { Type } from 'class-transformer';

export class MyGroup implements ForecastMyGroup {
  @IsString()
  groupId: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  coursePeriod?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  groupName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  courseId?: string | null;
  @IsString()
  groupType: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  forecastPeriod?: string | null;
  @IsNumber()
  /** @format int32 */
  totalPupils: number;
  @IsNumber()
  /** @format int32 */
  approvedPupils: number;
  @IsNumber()
  /** @format int32 */
  warningPupils: number;
  @IsNumber()
  /** @format int32 */
  unapprovedPupils: number;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  presence?: number | null;
  @IsArray()
  @IsOptional()
  @IsNullable()
  teachers: ForecastMyGroupTeacher[] | null;
}

export class MyGroupApiResponse implements ApiResponse<MyGroup> {
  @ValidateNested()
  @Type(() => MyGroup)
  data: MyGroup;
  @IsString()
  message: string;
}

export class MyGroupsApiResponse implements ApiResponse<MyGroup[]> {
  @ValidateNested({ each: true })
  @Type(() => MyGroup)
  data: MyGroup[];
  @IsString()
  message: string;
}

export class Pupil implements _Pupil {
  @IsString()
  @IsOptional()
  @IsNullable()
  pupil?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  groupId?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  forecastPeriod?: string | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  schoolYear?: number | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  SubjectsOpenToForceast?: number | null;
  @IsNumber()
  /** @format int32 */
  approved?: number | null;
  @IsNumber()
  /** @format int32 */
  warnings?: number | null;
  @IsNumber()
  /** @format int32 */
  unapproved?: number | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  presence?: number | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  forecast?: number | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  previousForecast?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  forecastTeacher?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  givenname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  lastname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  className?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  classGroupId?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  courseName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  courseId?: string | null;
  @IsArray()
  @IsOptional()
  @IsNullable()
  teachers?: ForecastMyGroupTeacher[] | null;
  @IsNumber()
  totalSubjects: number;
}

export class PupilApiResponse implements ApiResponse<Pupil> {
  @ValidateNested()
  @Type(() => Pupil)
  data: Pupil;
  @IsString()
  message: string;
}

export class PupilsApiResponse implements ApiResponse<Pupil[]> {
  @ValidateNested({ each: true })
  @Type(() => Pupil)
  data: Pupil[];
  @IsString()
  message: string;
}

export class MyMentorClassPupil implements _MyMentorClassPupil {
  pupil: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  givenname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  lastname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  forecastPeriod?: string | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  schoolYear?: number | null;
  @IsNumber()
  /** @format int32 */
  subjectsOpenToForecast: number;
  @IsNumber()
  /** @format int32 */
  approved: number;
  @IsNumber()
  /** @format int32 */
  warnings: number;
  @IsNumber()
  /** @format int32 */
  unapproved: number;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  presence?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  className?: string | null;
  @IsNumber()
  /** @format int32 */
  totalSubjects: number;
  @IsArray()
  @IsOptional()
  @IsNullable()
  teachers?: ForecastMyGroupTeacher[] | null;
}

export class MyMentorClassPupilsApiResponse implements ApiResponse<MyMentorClassPupil[]> {
  @ValidateNested({ each: true })
  @Type(() => MyMentorClassPupil)
  data: MyMentorClassPupil[];
  @IsString()
  message: string;
}
