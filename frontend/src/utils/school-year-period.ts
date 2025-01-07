import dayjs from 'dayjs';
import { capitalize } from 'underscore.string';

export const thisSchoolYearPeriod = () => {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  const monthToday = dayjs(currentDate).month();
  const summerBreak = [5, 6];
  let currentMonth;

  if (summerBreak.includes(monthToday)) {
    currentMonth = 'September';
  } else {
    currentMonth = capitalize(currentDate.toLocaleString('sv-SE', { month: 'long' }));
  }

  let previousMonth;
  let previousPeriodDate;

  if (currentMonth === 'September') {
    previousMonth = 'Maj';
    previousPeriodDate = new Date(currentDate.setMonth(4));
  } else if (currentMonth === 'Januari') {
    previousMonth = 'December';
    previousPeriodDate = new Date(currentYear - 1, 11, currentDate.getDate());
  } else {
    previousMonth = capitalize(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()).toLocaleString('sv-SE', {
        month: 'long',
      })
    );

    previousPeriodDate = new Date(currentDate.setMonth(new Date().getMonth() - 1));
  }

  let schoolYear;
  let termPeriod;
  if (monthToday >= 5 && monthToday <= 11) {
    schoolYear = currentYear;
    termPeriod = 'HT';
  } else if (monthToday <= 4 && monthToday >= 0) {
    schoolYear = currentYear - 1;
    termPeriod = 'VT';
  }

  const previousTermPeriod = termPeriod === 'HT' ? 'VT' : 'HT';
  const previousMonthPeriod = previousMonth === 'Maj' ? 'VT Maj' : `${termPeriod} ${previousMonth}`;
  const currentMonthPeriod = currentMonth === 'September' ? 'HT September' : `${termPeriod} ${currentMonth}`;

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
