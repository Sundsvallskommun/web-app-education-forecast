import { Spinner, useSnackbar } from '@sk-web-gui/react';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { SetForecastDto } from '@interfaces/forecast/forecast';
import { IsGradedForecast } from '@utils/is-grade-forecast';
import { useState } from 'react';

interface EditForecastprops {
  pupil: {
    pupilId: string;
    groupId: string;
    period: string;
    schoolYear: number;
  };
  forecast?: number | null | undefined;
}

export const EditForecast: React.FC<EditForecastprops> = ({ pupil, forecast }) => {
  const setForecast = useForecastStore((s) => s.setForecast);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear as number);
  const [forecastLoading, setForecastLoading] = useState(false);
  const { APPROVED, WARNINGS, UNNAPROVED } = IsGradedForecast(forecast, Number);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [focusedForecast, setFocusedForecast] = useState(false);
  const message = useSnackbar();

  const onSetForecastHandler = async (e) => {
    const forecast = e.target.value;
    sessionStorage.setItem('scrollposition', `${document.querySelectorAll('.sk-table-wrapper-inside')[0].scrollTop}`);
    const setForecastBody: SetForecastDto = {
      pupilId: pupil?.pupilId,
      groupId: pupil?.groupId,
      period: selectedPeriod,
      schoolYear: selectedSchoolYear,
      forecast: Number(forecast),
    };

    if (pupil.pupilId && forecast) {
      setForecastLoading(true);
      await setForecast(setForecastBody).then((res) => {
        if (res.data) {
          message({
            message: `Prognosen sparades`,
            status: 'success',
          });
          setForecastLoading(false);
          document
            .querySelectorAll('.sk-table-wrapper-inside')[0]
            .scrollTo(0, Number(sessionStorage.getItem('scrollposition')));
        } else {
          message({
            message: 'Prognosen kunde inte sparas',
            status: 'error',
          });
          setForecastLoading(false);
        }
      });
    }
  };

  const isSummer =
    selectedPeriod.includes('Juni') || selectedPeriod.includes('Juli') || selectedPeriod.includes('Augusti');

  return forecastLoading ? (
    <div className="flex w-[580px] justify-end">
      <Spinner size={4} />
    </div>
  ) : (
    <div className="flex w-[580px] justify-between">
      <label className={`flex gap-8 items-center ${!APPROVED && 'cursor-pointer'}`}>
        <input
          onChange={onSetForecastHandler}
          value={1}
          className={`${
            APPROVED
              ? 'p-6 border-4 bg-success border-white outline outline-offset-1 outline-2 outline-success'
              : 'p-6 border-4 bg-white border-white outline outline-offset-1 outline-1 outline-gray-500 hover:bg-primitives-overlay-darken-6 cursor-pointer'
          } `}
          disabled={APPROVED || isSummer}
          aria-disabled={APPROVED || isSummer}
          type="radio"
          name="forecast"
        ></input>
        <span className={`${APPROVED ? 'text-black font-semibold' : 'font-normal'} text-small`}>Når målen</span>
      </label>
      <label className={`flex gap-8 items-center ${!WARNINGS && 'cursor-pointer'}`}>
        <input
          onChange={onSetForecastHandler}
          value={2}
          className={`${
            WARNINGS
              ? 'p-6 border-4 bg-warning border-white outline outline-offset-1 outline-2 outline-warning'
              : 'p-6 border-4 bg-white border-white outline outline-offset-1 outline-1 outline-gray-500 hover:bg-primitives-overlay-darken-6 cursor-pointer'
          } `}
          disabled={WARNINGS || isSummer}
          aria-disabled={WARNINGS || isSummer}
          type="radio"
          name="forecast"
        ></input>
        <span className={`${WARNINGS ? 'text-black font-semibold' : 'font-normal'} text-small`}>Varning</span>
      </label>
      <label className={`flex gap-8 items-center ${!UNNAPROVED && 'cursor-pointer'}`}>
        <input
          onChange={onSetForecastHandler}
          value={3}
          className={`${
            UNNAPROVED
              ? 'p-6 border-4 bg-error border-white outline outline-offset-1 outline-2 outline-error'
              : 'p-6 border-4 bg-white border-white outline outline-offset-1 outline-1 outline-gray-500 hover:bg-primitives-overlay-darken-6 cursor-pointer'
          } `}
          disabled={UNNAPROVED || isSummer}
          aria-disabled={UNNAPROVED || isSummer}
          type="radio"
          name="forecast"
        ></input>
        <span className={`${UNNAPROVED ? 'text-black font-semibold' : 'font-normal'} text-small`}>Når ej målen</span>
      </label>
    </div>
  );
};
