import {
  CopyPreviousForecastDto,
  MentorClassPupil,
  MentorClassPupilGrid,
  MetaGroup,
  MetaPupils,
  MyGroup,
  Period,
  Pupil,
  SetForecastDto,
} from '@interfaces/forecast/forecast';
import { ApiResponse } from '@services/api-service';

export const handleGetPeriod: (res: ApiResponse<Period>) => Period = (res) => ({
  periodName: res.data.periodName,
  schoolYear: res.data.schoolYear,
  periodId: res.data.periodId,
  startDate: res.data.startDate,
  endDate: res.data.endDate,
});

export const handleGetAllPeriods: (res: ApiResponse<Period[]>) => Period[] = (res) => {
  return res.data.map((data) => ({
    periodName: data.periodName,
    schoolYear: data.schoolYear,
    periodId: data.periodId,
    startDate: data.startDate,
    endDate: data.endDate,
  }));
};

export const handleGetMyGroupResponse: (res: ApiResponse<MyGroup>) => MyGroup = (res) => ({
  groupId: res.data.groupId,
  coursePeriod: res.data.coursePeriod,
  groupName: res.data.groupName,
  courseId: res.data.courseId,
  groupType: res.data.groupType,
  forecastPeriod: res.data.forecastPeriod,
  totalPupils: res.data.totalPupils,
  approvedPupils: res.data.approvedPupils,
  warningPupils: res.data.warningPupils,
  unapprovedPupils: res.data.unapprovedPupils,
  presence: res.data.presence,
  teachers: res.data.teachers,
});

export const handleGetGroupsResponse: (res: ApiResponse<MyGroup[]>) => MyGroup[] = (res) => {
  return res.data.map((data) => ({
    groupId: data.groupId,
    coursePeriod: data.coursePeriod,
    groupName: data.groupName,
    courseId: data.courseId,
    groupType: data.groupType,
    forecastPeriod: data.forecastPeriod,
    totalPupils: data.totalPupils,
    approvedPupils: data.approvedPupils,
    warningPupils: data.warningPupils,
    unapprovedPupils: data.unapprovedPupils,
    presence: data.presence,
    teachers: data.teachers,
  }));
};

export const handleGetMetaGroupResponse: (res: ApiResponse<MetaGroup>) => MetaGroup = (res) => ({
  pageNumber: res.data.pageNumber,
  pageSize: res.data.pageSize,
  totalRecords: res.data.totalRecords,
  totalPages: res.data.totalPages,
  data: res.data.data,
});

export const handleGetPupil: (res: ApiResponse<Pupil>) => Pupil = (res) => ({
  pupil: res.data.pupil,
  groupId: res.data.groupId,
  forecastPeriod: res.data.forecastPeriod,
  schoolYear: res.data.schoolYear,
  subjectsOpenToForecast: res.data.subjectsOpenToForecast,
  approved: res.data.approved,
  warnings: res.data.warnings,
  unapproved: res.data.unapproved,
  presence: res.data.presence,
  forecast: res.data.forecast,
  previousForecast: res.data.previousForecast,
  forecastTeacher: res.data.forecastTeacher,
  givenname: res.data.givenname,
  lastname: res.data.lastname,
  className: res.data.className,
  courseName: res.data.courseName,
  courseId: res.data.courseId,
  teachers: res.data.teachers,
  syllabusId: res.data.syllabusId,
  totalSubjects: res.data.totalSubjects,
});

export const handleGetManyPupils: (res: ApiResponse<Pupil[]>) => Pupil[] = (res) => {
  return res.data.map((data) => ({
    pupil: data.pupil,
    groupId: data.groupId,
    forecastPeriod: data.forecastPeriod,
    schoolYear: data.schoolYear,
    subjectsOpenToForecast: data.subjectsOpenToForecast,
    approved: data.approved,
    warnings: data.warnings,
    unapproved: data.unapproved,
    presence: data.presence,
    forecast: data.forecast,
    previousForecast: data.previousForecast,
    forecastTeacher: data.forecastTeacher,
    givenname: data.givenname,
    lastname: data.lastname,
    className: data.className,
    classGroupId: data.classGroupId,
    courseName: data.courseName,
    courseId: data.courseId,
    syllabusId: data.syllabusId,
    unitId: data.unitId,
    typeOfSchool: data.typeOfSchool,
    teachers: data.teachers,
    totalSubjects: data.totalSubjects,
  }));
};

export const handleGetMetapupils: (res: ApiResponse<MetaPupils>) => MetaPupils = (res) => ({
  pageNumber: res.data.pageNumber,
  pageSize: res.data.pageSize,
  totalRecords: res.data.totalRecords,
  totalPages: res.data.totalPages,
  data: res.data.data,
});

export const handleGetMentorClassPupil: (res: ApiResponse<MentorClassPupil>) => MentorClassPupil = (res) => ({
  pupil: res.data.pupil,
  givenname: res.data.givenname,
  lastname: res.data.lastname,
  forecastPeriod: res.data.forecastPeriod,
  schoolYear: res.data.schoolYear,
  subjectsOpenToGrade: res.data.subjectsOpenToGrade,
  approved: res.data.approved,
  warnings: res.data.warnings,
  unapproved: res.data.unapproved,
  presence: res.data.presence,
  className: res.data.className,
  totalSubjects: res.data.totalSubjects,
});

export const handleGetMentorClassPupilGrid: (res: ApiResponse<MentorClassPupilGrid>) => MentorClassPupilGrid = (
  res
) => ({
  pupil: res.data.pupil,
  givenname: res.data.givenname,
  lastname: res.data.lastname,
  className: res.data.className,
  presence: res.data.presence,
  unitId: res.data.unitId,
  typeOfSchool: res.data.typeOfSchool,
  forecasts: res.data.forecasts,
});

export const handleGetMentorClass: (res: ApiResponse<MentorClassPupil[]>) => MentorClassPupil[] = (res) => {
  return res.data.map((data) => ({
    pupil: data.pupil,
    givenname: data.givenname,
    lastname: data.lastname,
    forecastPeriod: data.forecastPeriod,
    schoolYear: data.schoolYear,
    subjectsOpenToGrade: data.subjectsOpenToGrade,
    approved: data.approved,
    warnings: data.warnings,
    unapproved: data.unapproved,
    presence: data.presence,
    className: data.className,
    totalSubjects: data.totalSubjects,
    teachers: data.teachers,
  }));
};

export const handleGetMentorClassGrid: (res: ApiResponse<MentorClassPupilGrid[]>) => MentorClassPupilGrid[] = (res) => {
  return res.data.map((data) => ({
    pupil: data.pupil,
    givenname: data.givenname,
    lastname: data.lastname,
    className: data.className,
    presence: data.presence,
    typeOfSchool: data.typeOfSchool,
    unitId: data.unitId,
    forecasts: data.forecasts,
  }));
};

export const handleSendForecast: (res: SetForecastDto) => SetForecastDto = (res) => ({
  pupilId: res.pupilId,
  groupId: res.groupId,
  syllabusId: res.syllabusId,
  forecast: res.forecast,
});

export const handleCopyForecast: (res: CopyPreviousForecastDto) => CopyPreviousForecastDto = (res) => ({
  groupId: res.groupId,
  syllabusId: res.syllabusId,
});
