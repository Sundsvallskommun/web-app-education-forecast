export type ForecastMyGroup = {
  groupId: string;
  coursePeriod?: string | null;
  groupName?: string | null;
  courseId?: string | null;
  groupType: string;
  forecastPeriod?: string | null;
  totalPupils: number;
  approvedPupils: number;
  warningPupils: number;
  unapprovedPupils: number;
  presence?: number | null;
  typeOfSchool?: string | null;
  teachers: ForecastMyGroupTeacher[] | null;
};

export type ForecastMyGroupTeacher = {
  givenname?: string | null;
  lastname?: string | null;
  personId: string;
  email: string | null;
};

export type Pupil = {
  pupil?: string | null;
  groupId?: string | null;
  forecastPeriod?: string | null;
  schoolYear?: number | null;
  subjectsOpenToForecast?: number | null;
  approved?: number | null;
  warnings?: number | null;
  unapproved?: number;
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
  typeOfSchool?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
  totalSubjects: number;
};

export type MyMentorClassPupil = {
  pupil: string;
  givenname?: string | null;
  lastname?: string | null;
  forecastPeriod?: string | null;
  schoolYear?: number | null;
  subjectsOpenToForecast: number;
  approved: number;
  warnings: number;
  unapproved: number;
  presence?: number | null;
  className?: string | null;
  typeOfSchool?: string | null;
  totalSubjects: number;
  teachers?: ForecastMyGroupTeacher[] | null;
};
