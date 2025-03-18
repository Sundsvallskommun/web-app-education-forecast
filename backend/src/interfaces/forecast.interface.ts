export type Period = {
  periodName: string;
  schoolYear: number;
  periodId: number;
  startDate: Date;
  endDate: Date;
};

export type ForecastMetaGroups = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ForecastMyGroup[];
};

export type ForecastMyGroup = {
  groupId: string;
  coursePeriod?: string | null;
  groupName?: string | null;
  courseId?: string | null;
  syllabusId?: string | null;
  groupType: string;
  forecastPeriod?: string | null;
  unitId?: string | null;
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

export type ForecastMetaPupils = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: Pupil[];
};

export type Pupil = {
  pupil?: string | null;
  givenname?: string | null;
  lastname?: string | null;
  className?: string | null;
  groupId?: string | null;
  schoolYear?: number | null;
  forecastPeriod?: string | null;
  subjectsOpenToForecast?: number | null;
  approved?: number | null;
  warnings?: number | null;
  unapproved?: number;
  presence?: number | null;
  forecast?: number | null;
  previousForecast?: number | null;
  totalSubjects: number;
  forecastTeacher?: string | null;
  classGroupId?: string | null;
  courseName?: string | null;
  courseId?: string | null;
  syllabusId?: string | null;
  unitId?: string | null;
  typeOfSchool?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
};

export type ForecastMetaMentorClass = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: MyMentorClassPupilGrid[];
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

export type GridForecast = {
  groupId: string;
  courseName: string;
  courseId: string;
  syllabusId: string;
  forecast: number;
  previousForecast: number;
  schoolYear: number;
  forecastPeriod: string;
  forecastTeacher: string;
};

export type MyMentorClassPupilGrid = {
  pupil: string;
  givenname?: string | null;
  lastname?: string | null;
  className?: string | null;
  presence?: number | null;
  unitId?: string | null;
  typeOfSchool?: string | null;
  forecasts: GridForecast[];
};
