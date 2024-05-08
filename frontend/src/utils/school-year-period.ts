import dayjs from 'dayjs';

export const thisSchoolYearPeriod = () => {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();

  let currentMonth;

  if (
    dayjs(currentDate).month() >= dayjs(new Date(currentYear, 5, 1)).month() &&
    dayjs(currentDate).month() < dayjs(new Date(currentYear, 7, 1)).month()
  ) {
    currentMonth = 'September';
  } else {
    currentMonth =
      currentDate.toLocaleString('sv-SE', { month: 'long' }).charAt(0).toUpperCase() +
      currentDate.toLocaleString('sv-SE', { month: 'long' }).slice(1);
  }

  let previousMonth;
  let previousPeriodDate;

  if (currentMonth === 'September') {
    previousMonth = 'Maj';

    previousPeriodDate = new Date(currentDate.setMonth(new Date().getMonth() - 4));
  } else {
    previousMonth =
      new Date(currentDate.setMonth(new Date().getMonth() - 1))
        .toLocaleString('sv-SE', { month: 'long' })
        .charAt(0)
        .toUpperCase() +
      new Date(currentDate.setMonth(new Date().getMonth() - 1)).toLocaleString('sv-SE', { month: 'long' }).slice(1);

    previousPeriodDate = new Date(currentDate.setMonth(new Date().getMonth() - 1));
  }

  let schoolYear;
  let termPeriod;
  if (
    dayjs(new Date()).month() >= dayjs(new Date(currentYear, 5, 1)).month() &&
    dayjs(new Date()).month() <= dayjs(new Date(currentYear, 11, 31)).month()
  ) {
    schoolYear = currentYear;
    termPeriod = 'HT';
  } else if (
    dayjs(new Date()).month() <= dayjs(new Date(currentYear, 4, 30)).month() &&
    dayjs(new Date()).month() >= dayjs(new Date(currentYear, 1, 1)).month()
  ) {
    schoolYear = currentMonth === 'September' ? currentYear : currentYear - 1;
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
