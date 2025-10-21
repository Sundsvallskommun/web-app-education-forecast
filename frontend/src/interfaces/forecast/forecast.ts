export type Period = {
  periodName: string;
  schoolYear: number;
  periodId: number;
  startDate: string;
  endDate: string;
};
export interface MetaGroup {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: MyGroup[];
}

export interface SchoolClasses {
  schoolId: string;
  schoolName: string;
  classes: MetaGroup;
}

export interface MyGroup {
  groupId: string;
  coursePeriod?: string | null;
  groupName?: string | null;
  courseId?: string | null;
  syllabusId?: string | null;
  groupType: string;
  forecastPeriod?: string | null;
  unitId?: string | null;
  totalPupils: number | null;
  approvedPupils: number | null;
  warningPupils: number | null;
  unapprovedPupils: number | null;
  presence?: number | null;
  typeOfSchool?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
}

export interface QueriesDto {
  period: string | undefined;
  schoolYear: number;
}

export interface ForeacastQueriesDto {
  schoolId: string;
  periodId?: number | null;
  searchFilter?: string | null;
  PageNumber?: number | null;
  PageSize?: number | null;
  OrderBy: string;
  OrderDirection: 'ASC' | 'DESC';
}
export interface QuerySchoolsClasses {
  schools: { schoolId: string; schoolName: string }[];
  periodId?: number | null;
  searchFilter?: string | null;
  PageNumber?: number | null | undefined;
  PageSize?: number | null;
  OrderBy: string;
  OrderDirection: 'ASC' | 'DESC';
}

export interface ForecastMyGroupTeacher {
  givenname?: string | null;
  lastname?: string | null;
  personId: string;
  email: string | null;
}

export interface MetaPupils {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: Pupil[];
}

export interface Pupil {
  pupil?: string | null;
  groupId?: string | null;
  forecastPeriod?: string | null;
  schoolYear?: number | null;
  subjectsOpenToForecast?: number | null;
  approved?: number | null;
  warnings?: number | null;
  unapproved?: number | null;
  presence?: number | null;
  forecast?: number | null;
  previousForecast?: number | null;
  totalSubjects: number | null;
  forecastTeacher?: string | null;
  givenname?: string | null;
  lastname?: string | null;
  className?: string | null;
  classGroupId?: string | null;
  courseName?: string | null;
  courseId?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
  syllabusId?: string;
  unitId?: string | null;
  typeOfSchool?: string | null;
  image?: string | null;
  groupName?: string | null;
}

export interface MentorClassPupil {
  pupil: string;
  givenname?: string | null;
  lastname?: string | null;
  forecastPeriod?: string | null;
  schoolYear?: number | null;
  subjectsOpenToGrade: number;
  approved: number;
  warnings: number;
  unapproved: number;
  presence?: number | null;
  className?: string | null;
  totalSubjects: number;
  teachers?: ForecastMyGroupTeacher[] | null;
  image?: string | null;
}

export type GridForecast = {
  groupId: string;
  courseName: string;
  courseId: string;
  forecast: number;
  previousForecast: number;
  schoolYear: number;
  forecastPeriod: string;
  forecastTeacher: string;
};

export type MentorClassPupilGrid = {
  pupil: string;
  givenname?: string | null;
  lastname?: string | null;
  className?: string | null;
  presence?: number | null;
  unitId?: string | null;
  typeOfSchool?: string | null;
  forecasts: GridForecast[];
};

export interface Riffle {
  id: string;
  link: string;
  title: string;
}

export interface SetForecastDto {
  pupilId: string;
  groupId: string;
  forecast: number;
  syllabusId: string;
}

export interface CopyPreviousForecastDto {
  groupId: string;
  syllabusId: string;
}

export interface clearGroupForecastsDto {
  groupId: string;
  syllabusId: string;
}

export interface KeyStringTable {
  [key: string]: string | number | [] | object | null | undefined;
}
