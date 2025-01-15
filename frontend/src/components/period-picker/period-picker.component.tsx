import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Icon, Spinner } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import { formatPreviousPeriod } from '@utils/format-previous-period';

interface PeriodPickerProps {
  callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil';
}

export const PeriodPicker: React.FC<PeriodPickerProps> = ({ callback }) => {
  //stores
  const user = useUserStore((s) => s.user);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedId = useForecastStore((s) => s.selectedId as string);
  const getPreviousPeriodGroup = useForecastStore((s) => s.getPreviousPeriodGroup);

  //utils
  const { GR, GY } = hasRolePermission(user);
  const {
    currentYear,
    currentMonthPeriod,
    termPeriod,
    previousMonthPeriod,
    previousTermPeriod,
    previousPeriodDate,
    schoolYear,
  } = thisSchoolYearPeriod();

  let forecastPeriod;
  let DOMPeriod;

  if (GY) {
    forecastPeriod = currentMonthPeriod;
    DOMPeriod = selectedPeriod?.split('').slice(2);
  } else {
    forecastPeriod = termPeriod;
    DOMPeriod = `${selectedPeriod} ${selectedPeriod === 'VT' ? currentYear : selectedSchoolYear}`;
  }

  const pickPreviousHandler = async () => {
    let prevPeriod;
    let year;
    if (GY) {
      prevPeriod = previousMonthPeriod;
      if (previousPeriodDate <= new Date(currentYear, 7, 30)) {
        year = schoolYear;
      } else if (previousPeriodDate > new Date(currentYear, 7, 30)) {
        year = currentYear;
      }
    } else if (GR) {
      prevPeriod = previousTermPeriod;
      if (termPeriod === 'HT') {
        year = currentYear - 1;
      } else if (termPeriod === 'VT') {
        year = schoolYear;
      }
    }
    const { previousPeriod, previousSchoolYear } = formatPreviousPeriod(user, prevPeriod, year);

    await setSelectedPeriod(
      GY && previousMonthPeriod === 'VT Maj' ? 'VT Maj' : (prevPeriod as string),
      GY && (previousMonthPeriod === 'VT Maj' || previousMonthPeriod === 'HT December')
        ? currentYear - 1
        : (year as number),
      callback,
      selectedId,
      user
    );
    callback === 'subject' &&
      (await getPreviousPeriodGroup(selectedId, {
        period: GY && previousMonthPeriod === 'VT Maj' ? 'VT Maj' : previousPeriod,
        schoolYear:
          GY && (previousMonthPeriod === 'VT Maj' || previousMonthPeriod === 'HT December')
            ? currentYear - 1
            : previousSchoolYear,
      }));
  };

  const pickForwardToCurrentHandler = async () => {
    let currentPeriod: string | undefined;
    let year;
    if (GY) {
      currentPeriod = forecastPeriod;
      year = schoolYear;
    } else if (GR) {
      currentPeriod = termPeriod;
      year = schoolYear;
    }
    const { previousPeriod, previousSchoolYear } = formatPreviousPeriod(user, currentPeriod, year);

    await setSelectedPeriod(currentPeriod as string, year as number, callback, selectedId, user);
    callback === 'subject' &&
      (await getPreviousPeriodGroup(selectedId, { period: previousPeriod, schoolYear: previousSchoolYear }));
  };

  return (
    <div className="flex gap-20 justify-center items-center">
      <Button
        aria-describedby={`Visa tidigare till period ${
          GY ? previousMonthPeriod : previousTermPeriod === 'HT' ? 'Hösttermin' : 'Vårtermin'
        }`}
        onClick={pickPreviousHandler}
        disabled={(GY && selectedPeriod === previousMonthPeriod) || (GR && selectedPeriod === previousTermPeriod)}
        iconButton
        color="vattjom"
        size="sm"
        rounded
        inverted={selectedPeriod === forecastPeriod}
      >
        <Icon name="arrow-left" />
      </Button>
      <span className="font-bold">{selectedPeriod?.length !== 0 ? DOMPeriod : <Spinner size={3} />}</span>
      <Button
        aria-describedby={`Visa framåt till nuvarande period ${
          GY ? currentMonthPeriod : termPeriod === 'HT' ? 'Hösttermin' : 'Vårtermin'
        }`}
        onClick={pickForwardToCurrentHandler}
        iconButton
        color="vattjom"
        disabled={selectedPeriod === forecastPeriod}
        size="sm"
        rounded
        inverted={selectedPeriod !== forecastPeriod}
      >
        <Icon name="arrow-right" />
      </Button>
    </div>
  );
};
