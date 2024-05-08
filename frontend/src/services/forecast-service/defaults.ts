import { MyGroup, Pupil } from '@interfaces/forecast/forecast';

export const emptyMyGroup: MyGroup = {
  groupId: '',
  coursePeriod: '',
  groupName: '',
  courseId: '',
  groupType: '',
  forecastPeriod: '',
  totalPupils: null,
  approvedPupils: null,
  warningPupils: null,
  unapprovedPupils: null,
  presence: null,
  teachers: [],
};

export const emptyPupil: Pupil = {
  pupil: '',
  groupId: '',
  forecastPeriod: '',
  schoolYear: null,
  subjectsOpenToForecast: null,
  approved: null,
  warnings: null,
  unapproved: null,
  presence: null,
  forecast: null,
  previousForecast: null,
  forecastTeacher: '',
  givenname: '',
  lastname: '',
  className: '',
  classGroupId: '',
  courseName: '',
  courseId: '',
  teachers: [],
  totalSubjects: null,
};
