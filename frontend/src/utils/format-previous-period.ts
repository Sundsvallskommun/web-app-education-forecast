import { User } from '@interfaces/user';
import { hasRolePermission } from './has-role-permission';

export const formatPreviousPeriod = (user: User, selectedPeriod: string, selectedSchoolYear: number) => {
  const { GY, GR } = hasRolePermission(user);

  const monthPeriods = [
    'VT Januari',
    'VT Februari',
    'VT Mars',
    'VT April',
    'VT Maj',
    'HT September',
    'HT Oktober',
    'HT November',
    'HT December',
  ];

  const termPeriods = ['HT', 'VT'];
  let previousPeriod;
  let previousSchoolYear;

  if (GY) {
    monthPeriods[monthPeriods.indexOf(selectedPeriod)] === monthPeriods[0]
      ? (previousPeriod = monthPeriods[monthPeriods.length - 1])
      : (previousPeriod = monthPeriods[monthPeriods.indexOf(selectedPeriod) - 1]);

    monthPeriods.indexOf(previousPeriod) === monthPeriods.indexOf('VT Maj')
      ? (previousSchoolYear = selectedSchoolYear - 1)
      : (previousSchoolYear = selectedSchoolYear);
  } else if (GR) {
    termPeriods[termPeriods.indexOf(selectedPeriod)] === termPeriods[0]
      ? (previousPeriod = termPeriods[termPeriods.length - 1])
      : (previousPeriod = termPeriods[termPeriods.indexOf(selectedPeriod) - 1]);

    previousPeriod === 'VT' ? (previousSchoolYear = selectedSchoolYear - 1) : (previousSchoolYear = selectedSchoolYear);
  }

  return { previousPeriod, previousSchoolYear };
};
