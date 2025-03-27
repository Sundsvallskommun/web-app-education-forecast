import { Button, Icon, Spinner } from '@sk-web-gui/react';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { StringifyOptions } from 'node:querystring';

interface RiffleProps {
  callback: 'classes' | 'pupils' | 'subjects' | 'mentorclass' | 'pupil' | 'subject';
  riffleIsLoading: boolean;
  riffleObjects: Array<{
    id: string;
    link: string;
    title: string;
  }>;

  currentId?: string;
}

export const RifflePrevNext: React.FC<RiffleProps> = ({ riffleObjects, riffleIsLoading, callback, currentId }) => {
  const router = useRouter();
  const selectedId = currentId;

  const currentRiffle = riffleObjects.find((f) => f.id === selectedId?.toLowerCase());
  const prevRiffle =
    riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0])] === riffleObjects[0]
      ? riffleObjects[riffleObjects.length - 1]
      : riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0]) - 1];
  const nextRiffle =
    riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0])] === riffleObjects[riffleObjects.length - 1]
      ? riffleObjects[0]
      : riffleObjects[riffleObjects.indexOf(currentRiffle ?? riffleObjects[0]) + 1];

  const riffleHandler = (link: string) => {
    router.push(link);
  };

  return !riffleIsLoading ? (
    <div className={`w-full flex ${riffleObjects.length > 2 ? 'justify-between' : 'justify-end'} mt-24`}>
      {riffleObjects.length > 2 ? (
        <Button
          onClick={() => riffleHandler(prevRiffle.link)}
          leftIcon={<Icon name="arrow-left" />}
          variant="secondary"
        >
          {prevRiffle?.title}
        </Button>
      ) : (
        <></>
      )}

      <Button
        onClick={() => riffleHandler(nextRiffle.link)}
        rightIcon={<Icon name="arrow-right" />}
        variant="secondary"
      >
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
