export interface MyGroup {
  groupId: string;
  coursePeriod?: string | null;
  groupName?: string | null;
  courseId?: string | null;
  groupType: string;
  forecastPeriod?: string | null;
  totalPupils: number | null;
  approvedPupils: number | null;
  warningPupils: number | null;
  unapprovedPupils: number | null;
  presence?: number | null;
  teachers?: ForecastMyGroupTeacher[] | null;
}

export interface QueriesDto {
  period: string | undefined;
  schoolYear: number;
}

export interface ForecastMyGroupTeacher {
  givenname?: string | null;
  lastname?: string | null;
  personId: string;
  email: string | null;
}

export interface Pupil {
  pupil?: string | null;
  groupId?: string | null;
  forecastPeriod?: string | null;
  schoolYear?: number | null;
  subjectsOpenToForecast?: number | null;
  approved: number | null;
  warnings: number | null;
  unapproved: number | null;
  presence?: number | null;
  forecast?: number | null;
  previousForecast?: number | null;
  forecastTeacher?: string | null;
  givenname?: string | null;
  lastname?: string | null;
  className?: string | null;
  classGroupId?: string | null;
  courseName?: string | null;
  courseId?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
  totalSubjects: number | null;
  image?: string | null;
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
  period: string;
  schoolYear: number;
  forecast: number;
}

export interface CopyPreviousForecastDto {
  groupId: string;
  period: string;
  previusPeriod: string;
  schoolYear: number;
  previusSchoolYear: number;
}

export interface clearGroupForecastsDto {
  groupId: string;
  period: string;
  schoolYear: number;
}
