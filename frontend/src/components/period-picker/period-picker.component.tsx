import { useUserStore } from '@services/user-service/user-service';
import { Button, Icon, Spinner } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface PeriodPickerProps {
  callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil';
}

export const PeriodPicker: React.FC<PeriodPickerProps> = () => {
  //stores
  const user = useUserStore((s) => s.user);
  const { GY } = hasRolePermission(user);
  const setSelectedPeriod = usePupilForecastStore((s) => s.setSelectedPeriod);
  const allPeriods = usePupilForecastStore((s) => s.allPeriods);
  const currentPeriod = usePupilForecastStore((s) => s.currentPeriod);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const selectedIndex = allPeriods.findIndex((p) => p.periodId === selectedPeriod.periodId);

  // const { watch, setValue, register, formState } = useFormContext<SelectedPeriodForm>();
  // const selectedPeriod = watch('selectedPeriod');
  //utils

  useEffect(() => {
    if (selectedPeriod.periodId === 0) {
      setSelectedPeriod(currentPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPeriod]);

  const { currentMonthPeriod, termPeriod, previousMonthPeriod, previousTermPeriod } = thisSchoolYearPeriod();

  // let forecastPeriod: string = currentMonthPeriod;
  // let DOMPeriod: string = `${selectedPeriod?.slice(2)}`;

  // if (GY) {
  //   forecastPeriod = currentMonthPeriod;
  //   DOMPeriod = `${selectedPeriod?.slice(2)}`;
  // } else {
  //   forecastPeriod = termPeriod;
  //   DOMPeriod = `${selectedPeriod} ${selectedPeriod === 'VT' ? currentYear : selectedSchoolYear}`;
  // }

  const pickPreviousHandler = async () => {
    const previous = allPeriods[selectedIndex - 1];

    selectedIndex !== 0 && setSelectedPeriod(previous);
  };

  const pickForwardToCurrentHandler = async () => {
    const forward = allPeriods[selectedIndex + 1];
    selectedIndex !== allPeriods.length - 1 && setSelectedPeriod(forward);
  };

  const periodName = () => {
    const date1 = new Date(selectedPeriod?.periodName.slice(0, 10));
    const date2 = new Date(selectedPeriod?.periodName.slice(11));

    return `${dayjs(date1).format('DD MMMM YYYY')} - ${dayjs(date2).format('DD MMMM YYYY')}`;
  };

  return (
    <div className="flex gap-20 justify-center items-center">
      <Button
        aria-describedby={`Visa tidigare till period ${
          GY ? previousMonthPeriod : previousTermPeriod === 'HT' ? 'Hösttermin' : 'Vårtermin'
        }`}
        onClick={pickPreviousHandler}
        disabled={selectedPeriod?.periodId === allPeriods[0]?.periodId}
        // disabled={(GY && selectedPeriod === previousMonthPeriod) || (GR && selectedPeriod === previousTermPeriod)}
        iconButton
        color="vattjom"
        size="sm"
        rounded
        inverted={selectedPeriod?.periodId === currentPeriod.periodId}
      >
        <Icon name="arrow-left" />
      </Button>
      <div>
        {selectedPeriod && selectedPeriod.periodId !== 0 ? (
          GY ? (
            <>
              <span className="font-bold block text-center">Period {selectedPeriod.periodId}</span>
              <span>{periodName()}</span>
            </>
          ) : (
            <span className="font-bold block text-center">{selectedPeriod.periodName}</span>
          )
        ) : (
          <Spinner size={3} />
        )}
      </div>
      <Button
        aria-describedby={`Visa framåt till nuvarande period ${
          GY ? currentMonthPeriod : termPeriod === 'HT' ? 'Hösttermin' : 'Vårtermin'
        }`}
        onClick={pickForwardToCurrentHandler}
        iconButton
        color="vattjom"
        disabled={selectedPeriod?.periodId === currentPeriod.periodId}
        size="sm"
        rounded
        inverted={selectedPeriod?.periodId !== currentPeriod.periodId}
      >
        <Icon name="arrow-right" />
      </Button>
    </div>
  );
};
