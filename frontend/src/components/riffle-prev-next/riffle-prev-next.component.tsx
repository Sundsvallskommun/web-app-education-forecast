import { Button, cx, Icon } from '@sk-web-gui/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  return (
    <div className={`w-full flex ${riffleObjects.length > 2 ? 'justify-between' : 'justify-end'} mt-24`}>
      {riffleObjects.length > 2 ? (
        <Button
          className={cx({ ['skeleton']: riffleIsLoading })}
          disabled={riffleIsLoading}
          aria-busy={riffleIsLoading}
          onClick={() => riffleHandler(prevRiffle.link)}
          leftIcon={riffleIsLoading ? undefined : <Icon icon={<ArrowLeft />} />}
          variant="secondary"
        >
          {riffleIsLoading ? <span className="text-transparent">Laddar tidigare</span> : prevRiffle?.title}
        </Button>
      ) : (
        <></>
      )}

      <Button
        className={cx({ ['skeleton']: riffleIsLoading })}
        disabled={riffleIsLoading}
        aria-busy={riffleIsLoading}
        onClick={() => riffleHandler(nextRiffle.link)}
        rightIcon={riffleIsLoading ? undefined : <Icon icon={<ArrowRight />} />}
        variant="secondary"
      >
        {riffleIsLoading ? <span className="text-transparent">Laddar senare</span> : nextRiffle?.title}
      </Button>
    </div>
  );
};
