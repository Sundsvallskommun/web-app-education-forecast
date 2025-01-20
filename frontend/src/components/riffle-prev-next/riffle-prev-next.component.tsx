import { Button, Icon, Spinner } from '@sk-web-gui/react';
import { useForecastStore } from '@services/forecast-service/forecats-service';

interface RiffleProps {
  callback: 'classes' | 'pupils' | 'subjects' | 'mentorclass' | 'pupil' | 'subject';
  riffleIsLoading: boolean;
  riffleObjects: Array<{
    id: string;
    link: string;
    title: string;
  }>;

  dataId?: string;
}

export const RifflePrevNext: React.FC<RiffleProps> = ({ riffleObjects, riffleIsLoading, callback, dataId }) => {
  const selectedId = useForecastStore((s) => s.selectedId) || dataId;
  const setObjectWithPeriod = useForecastStore((s) => s.setSelectedPeriod);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);

  const currentRiffle = riffleObjects.find((f) => f.id === selectedId?.toLowerCase());
  const prevRiffle =
    riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0])] === riffleObjects[0]
      ? riffleObjects[riffleObjects.length - 1]
      : riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0]) - 1];
  const nextRiffle =
    riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0])] === riffleObjects[riffleObjects.length - 1]
      ? riffleObjects[0]
      : riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0]) + 1];

  const riffleHandler = (id: string) => {
    setObjectWithPeriod(selectedPeriod, selectedSchoolYear, callback, id);
  };

  return !riffleIsLoading ? (
    <div className={`w-full flex ${riffleObjects.length > 2 ? 'justify-between' : 'justify-end'} mt-24`}>
      {riffleObjects.length > 2 ? (
        <Button onClick={() => riffleHandler(prevRiffle.id)} leftIcon={<Icon name="arrow-left" />} variant="secondary">
          {prevRiffle?.title}
        </Button>
      ) : (
        <></>
      )}

      <Button onClick={() => riffleHandler(nextRiffle.id)} rightIcon={<Icon name="arrow-right" />} variant="secondary">
        {nextRiffle?.title}
      </Button>
    </div>
  ) : (
    <div className={`w-full flex justify-between mt-24`}>
      <Spinner size={3} />
      <Spinner size={3} />
    </div>
  );
};
