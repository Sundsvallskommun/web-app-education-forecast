import { User } from '@interfaces/user';

export const hasRolePermission = (user: User) => {
  const roles = user.roles;
  const headmaster = roles.find((x) => x.role === 'ForecastUser');
  const teacher = roles.find((x) => x.role === 'GradeAuthor');
  const mentor = roles.find((x) => x.role === 'Mentor');

  const GR = roles.find((x) => x.typeOfSchool === 'GR');
  const GY = roles.find((x) => x.typeOfSchool === 'GY');

  const canEditForecast = teacher || mentor;
  const canViewAllSubjectsGroups = headmaster;
  const canViewMySubjectsGroups = teacher || mentor;
  const canViewMyMentorClass = mentor;
  const canViewAllClasses = headmaster;
  const canViewPupil = teacher || mentor || headmaster;
  const canViewAllPupils = headmaster;

  return {
    canEditForecast,
    canViewAllSubjectsGroups,
    canViewMySubjectsGroups,
    canViewMyMentorClass,
    canViewAllClasses,
    canViewPupil,
    canViewAllPupils,
    headmaster,
    teacher,
    mentor,
    GR,
    GY,
  };
};
