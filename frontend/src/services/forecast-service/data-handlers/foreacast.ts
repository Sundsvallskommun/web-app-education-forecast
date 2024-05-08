import {
  CopyPreviousForecastDto,
  MentorClassPupil,
  MyGroup,
  Pupil,
  SetForecastDto,
} from '@interfaces/forecast/forecast';
import { ApiResponse } from '@services/api-service';

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

export const handleGetMyGroupsResponse: (res: ApiResponse<MyGroup[]>) => MyGroup[] = (res) => {
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
    teachers: data.teachers,
    totalSubjects: data.totalSubjects,
  }));
};

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

export const handleSendForecast: (res: SetForecastDto) => SetForecastDto = (res) => ({
  pupilId: res.pupilId,
  groupId: res.groupId,
  period: res.period,
  schoolYear: res.schoolYear,
  forecast: res.forecast,
});

export const handleCopyForecast: (res: CopyPreviousForecastDto) => CopyPreviousForecastDto = (res) => ({
  groupId: res.groupId,
  period: res.period,
  previusPeriod: res.previusPeriod,
  schoolYear: res.schoolYear,
});
