import { Spinner, useSnackbar } from '@sk-web-gui/react';
import { SetForecastDto } from '@interfaces/forecast/forecast';
import { IsGradedForecast } from '@utils/is-grade-forecast';
import { useState } from 'react';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

interface EditForecastprops {
  pupil: {
    syllabusId: string;
    pupilId: string;
    groupId: string;
  };
  forecast?: number | null;
}

export const EditForecast: React.FC<EditForecastprops> = ({ pupil, forecast }) => {
  const setForecast = usePupilForecastStore((s) => s.setForecast);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const currentPeriod = usePupilForecastStore((s) => s.currentPeriod);
  const [forecastLoading, setForecastLoading] = useState(false);
  const { APPROVED, WARNINGS, UNNAPROVED } = IsGradedForecast(forecast);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const message = useSnackbar();

  const onSetForecastHandler = async (e: React.BaseSyntheticEvent) => {
    const forecast = e.target.value;
    sessionStorage.setItem('scrollposition', `${document.querySelectorAll('.sk-table-wrapper-inside')[0].scrollTop}`);
    const setForecastBody: SetForecastDto = {
      pupilId: pupil?.pupilId,
      groupId: pupil?.groupId,
      syllabusId: pupil.syllabusId,
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

  return forecastLoading ? (
    <div className="flex w-[580px] justify-end">
      <Spinner size={4} />
    </div>
  ) : (
    <div className="flex w-[580px] justify-between">
      <label
        className={`flex gap-8 items-center ${!APPROVED && selectedPeriod.periodId === currentPeriod.periodId && 'cursor-pointer'}`}
      >
        <input
          onChange={onSetForecastHandler}
          value={1}
          className={`${
            APPROVED
              ? 'p-6 border-4 bg-success border-white outline outline-offset-1 outline-2 outline-success'
              : selectedPeriod.periodId === currentPeriod.periodId
                ? 'p-6 border-4 bg-white border-white outline outline-offset-1 outline-1 outline-gray-500 hover:bg-primitives-overlay-darken-6 cursor-pointer'
                : 'p-6 border-4 bg-gray-200 border-gray-200 outline outline-offset-1 outline-1 outline-gray-300'
          } `}
          disabled={APPROVED || selectedPeriod.periodId !== currentPeriod.periodId}
          aria-disabled={APPROVED || selectedPeriod.periodId !== currentPeriod.periodId}
          type="radio"
          name="forecast"
        ></input>
        <span
          className={`${APPROVED ? (selectedPeriod.periodId === currentPeriod.periodId ? 'text-black font-semibold' : 'text-gray-400 font-semibold') : selectedPeriod.periodId === currentPeriod.periodId ? 'font-normal' : 'text-gray-600 font-normal'} text-small`}
        >
          Når målen
        </span>
      </label>
      <label
        className={`flex gap-8 items-center ${!WARNINGS && selectedPeriod.periodId === currentPeriod.periodId && 'cursor-pointer'}`}
      >
        <input
          onChange={onSetForecastHandler}
          value={2}
          className={`${
            WARNINGS
              ? 'p-6 border-4 bg-warning border-white outline outline-offset-1 outline-2 outline-warning'
              : selectedPeriod.periodId === currentPeriod.periodId
                ? 'p-6 border-4 bg-white border-white outline outline-offset-1 outline-1 outline-gray-500 hover:bg-primitives-overlay-darken-6 cursor-pointer'
                : 'p-6 border-4 bg-gray-200 border-gray-200 outline outline-offset-1 outline-1 outline-gray-300'
          } `}
          disabled={WARNINGS || selectedPeriod.periodId !== currentPeriod.periodId}
          aria-disabled={WARNINGS || selectedPeriod.periodId !== currentPeriod.periodId}
          type="radio"
          name="forecast"
        ></input>
        <span
          className={`${WARNINGS ? (selectedPeriod.periodId === currentPeriod.periodId ? 'text-black font-semibold' : 'text-gray-400 font-semibold') : selectedPeriod.periodId === currentPeriod.periodId ? 'font-normal' : 'text-gray-600 font-normal'} text-small`}
        >
          Varning
        </span>
      </label>
      <label
        className={`flex gap-8 items-center ${!UNNAPROVED && selectedPeriod.periodId === currentPeriod.periodId && 'cursor-pointer'}`}
      >
        <input
          onChange={onSetForecastHandler}
          value={3}
          className={`${
            UNNAPROVED
              ? 'p-6 border-4 bg-error border-white outline outline-offset-1 outline-2 outline-error'
              : selectedPeriod.periodId === currentPeriod.periodId
                ? 'p-6 border-4 bg-white border-white outline outline-offset-1 outline-1 outline-gray-500 hover:bg-primitives-overlay-darken-6 cursor-pointer'
                : 'p-6 border-4 bg-gray-200 border-gray-200 outline outline-offset-1 outline-1 outline-gray-300'
          } `}
          disabled={UNNAPROVED || selectedPeriod.periodId !== currentPeriod.periodId}
          aria-disabled={UNNAPROVED || selectedPeriod.periodId !== currentPeriod.periodId}
          type="radio"
          name="forecast"
        ></input>
        <span
          className={`${UNNAPROVED ? (selectedPeriod.periodId === currentPeriod.periodId ? 'text-black font-semibold' : 'text-gray-400 font-semibold') : selectedPeriod.periodId === currentPeriod.periodId ? 'font-normal' : 'text-gray-600 font-normal'} text-small`}
        >
          Når ej målen
        </span>
      </label>
    </div>
  );
};
