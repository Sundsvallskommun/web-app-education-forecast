import { Button, Icon, Spinner } from '@sk-web-gui/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

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

export const RifflePrevNext: React.FC<RiffleProps> = ({ riffleObjects, riffleIsLoading, currentId }) => {
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

  const riffleHandler = async (link: string) => {
    await router.push(link);
  };

  return !riffleIsLoading ? (
    <div className={`w-full flex ${riffleObjects.length > 2 ? 'justify-between' : 'justify-end'} mt-24`}>
      {riffleObjects.length > 2 ? (
        <Button
          onClick={() => riffleHandler(prevRiffle.link)}
          leftIcon={<Icon icon={<ArrowLeft />} />}
          variant="secondary"
        >
          {prevRiffle?.title}
        </Button>
      ) : (
        <></>
      )}

      <Button
        onClick={() => riffleHandler(nextRiffle.link)}
        rightIcon={<Icon icon={<ArrowRight />} />}
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
