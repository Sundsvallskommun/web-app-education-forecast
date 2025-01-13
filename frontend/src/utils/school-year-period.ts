import dayjs from 'dayjs';
import { capitalize } from 'underscore.string';

export const thisSchoolYearPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = dayjs(currentDate).month();
  const summerBreak = [5, 6];
  let currentSchoolMonth;

  if (summerBreak.includes(currentMonth)) {
    currentSchoolMonth = 'September';
  } else {
    currentSchoolMonth = capitalize(currentDate.toLocaleString('sv-SE', { month: 'long' }));
  }

  let previousSchoolMonth;
  let previousPeriodDate;

  if (currentSchoolMonth === 'September') {
    previousSchoolMonth = 'Maj';
    previousPeriodDate = new Date(currentDate.setMonth(4));
  } else if (currentSchoolMonth === 'Januari') {
    previousSchoolMonth = 'December';
    previousPeriodDate = new Date(currentYear - 1, 11, currentDate.getDate());
  } else {
    previousSchoolMonth = capitalize(
      new Date(currentYear, currentDate.getMonth() - 1, currentDate.getDate()).toLocaleString('sv-SE', {
        month: 'long',
      })
    );

    previousPeriodDate = new Date(currentDate.setMonth(new Date().getMonth() - 1));
  }

  let schoolYear = currentYear;
  let termPeriod;
  if (currentMonth >= 5 && currentMonth <= 11) {
    schoolYear = currentYear;
    termPeriod = 'HT';
  } else if (currentMonth <= 4 && currentMonth >= 0) {
    schoolYear = currentYear - 1;
    termPeriod = 'VT';
  }

  const previousTermPeriod = termPeriod === 'HT' ? 'VT' : 'HT';
  const previousMonthPeriod =
    previousSchoolMonth === 'Maj'
      ? 'VT Maj'
      : previousSchoolMonth === 'December'
        ? 'HT December'
        : `${termPeriod} ${previousSchoolMonth}`;
  const currentMonthPeriod =
    currentSchoolMonth === 'September' ? 'HT September' : `${termPeriod} ${currentSchoolMonth}`;

  return {
    schoolYear,
    currentYear,
    currentMonthPeriod,
    termPeriod,
    previousTermPeriod,
    previousMonthPeriod,
    previousPeriodDate,
  };
};
