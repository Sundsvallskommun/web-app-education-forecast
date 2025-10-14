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
    if (monthPeriods[monthPeriods.indexOf(selectedPeriod)] === monthPeriods[0]) {
      previousPeriod = monthPeriods[monthPeriods.length - 1];
    } else {
      previousPeriod = monthPeriods[monthPeriods.indexOf(selectedPeriod) - 1];
    }

    if (monthPeriods.indexOf(previousPeriod) === monthPeriods.indexOf('VT Maj')) {
      previousSchoolYear = selectedSchoolYear - 1;
    } else {
      previousSchoolYear = selectedSchoolYear;
    }
  } else if (GR) {
    if (termPeriods[termPeriods.indexOf(selectedPeriod)] === termPeriods[0]) {
      previousPeriod = termPeriods.at(-1);
    } else {
      previousPeriod = termPeriods[termPeriods.indexOf(selectedPeriod) - 1];
    }

    if (previousPeriod === 'VT') {
      previousSchoolYear = selectedSchoolYear - 1;
    } else {
      previousSchoolYear = selectedSchoolYear;
    }
  }

  return { previousPeriod, previousSchoolYear };
};
