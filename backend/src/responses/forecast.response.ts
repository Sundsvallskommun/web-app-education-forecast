import { IsNumber, IsOptional, IsString, IsArray, ValidateNested, IsDate } from 'class-validator';
import {
  ForecastMyGroupTeacher,
  ForecastMyGroup,
  Pupil as _Pupil,
  MyMentorClassPupil as _MyMentorClassPupil,
  MyMentorClassPupilGrid,
  GridForecast,
  Period as _Period,
  ForecastMetaGroups as _ForecastMetaGroups,
  ForecastMetaPupils as _ForecastMetaPupils,
  ForecastMetaMentorClass as _ForecastMetaMentorClass,
} from '@/interfaces/forecast.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import ApiResponse from '@/interfaces/api-service.interface';
import { Type } from 'class-transformer';

export class Period implements _Period {
  @IsString()
  periodName: string;
  @IsNumber()
  /** @format int32 */
  schoolYear: number;
  @IsNumber()
  /** @format int32 */
  periodId: number;
  @IsDate()
  startDate: Date;
  @IsDate()
  endDate: Date;
}

export class PeriodApiResponse implements ApiResponse<Period> {
  @ValidateNested()
  @Type(() => Period)
  data: Period;
  @IsString()
  message: string;
}

export class PeriodsApiResponse implements ApiResponse<Period[]> {
  @ValidateNested()
  @Type(() => Period)
  data: Period[];
  @IsString()
  message: string;
}

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
  syllabusId?: string | null;
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
  @IsString()
  @IsOptional()
  @IsNullable()
  unitId?: string | null;
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
  @IsString()
  @IsOptional()
  @IsNullable()
  typeOfSchool?: string | null;
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

export class ForecastMetaGroups implements _ForecastMetaGroups {
  @IsNumber()
  /** @format int32 */
  pageNumber: number;
  @IsNumber()
  /** @format int32 */
  pageSize: number;
  @IsNumber()
  /** @format int32 */
  totalRecords: number;
  @IsNumber()
  /** @format int32 */
  totalPages: number;
  @IsArray()
  data: MyGroup[];
}

export class ForecastMetaGroupsApiResponse implements ApiResponse<ForecastMetaGroups> {
  @ValidateNested()
  @Type(() => ForecastMetaGroups)
  data: ForecastMetaGroups;
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
  @IsString()
  @IsOptional()
  @IsNullable()
  unitId?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  syllabusId?: string | null;
  @IsArray()
  @IsOptional()
  @IsNullable()
  teachers?: ForecastMyGroupTeacher[] | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  typeOfSchool?: string | null;
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

export class ForecastMetaPupils implements _ForecastMetaPupils {
  @IsNumber()
  /** @format int32 */
  pageNumber: number;
  @IsNumber()
  /** @format int32 */
  pageSize: number;
  @IsNumber()
  /** @format int32 */
  totalRecords: number;
  @IsNumber()
  /** @format int32 */
  totalPages: number;
  @IsArray()
  data: Pupil[];
}

export class ForecastMetaPupilsApiResponse implements ApiResponse<ForecastMetaPupils> {
  @ValidateNested({ each: true })
  @Type(() => ForecastMetaPupils)
  data: ForecastMetaPupils;
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

export class MentorClassPupilGrid implements MyMentorClassPupilGrid {
  @IsString()
  @IsOptional()
  @IsNullable()
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
  className?: string | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  presence?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  typeOfSchool?: string | null;
  @IsArray()
  @IsOptional()
  @IsNullable()
  forecasts: GridForecast[];
}

export class MentorClassPupilGridApiResponse implements ApiResponse<MentorClassPupilGrid[]> {
  @ValidateNested({ each: true })
  @Type(() => MentorClassPupilGrid)
  data: MentorClassPupilGrid[];
  @IsString()
  message: string;
}

export class ForecastMetaMentorClass implements _ForecastMetaMentorClass {
  @IsNumber()
  /** @format int32 */
  pageNumber: number;
  @IsNumber()
  /** @format int32 */
  pageSize: number;
  @IsNumber()
  /** @format int32 */
  totalRecords: number;
  @IsNumber()
  /** @format int32 */
  totalPages: number;
  @IsArray()
  data: MentorClassPupilGrid[];
}

export class ForecastMetaMentorClassApiResponse implements ApiResponse<ForecastMetaMentorClass> {
  @ValidateNested({ each: true })
  @Type(() => ForecastMetaMentorClass)
  data: ForecastMetaMentorClass;
  @IsString()
  message: string;
}
