import { Button, Icon, Modal, useSnackbar } from '@sk-web-gui/react';

import { useEffect, useState } from 'react';
import { CopyPreviousForecastDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

interface ICopyPreviousForecast {
  syllabusId: string;
}

export const CopyPreviousForecast: React.FC<ICopyPreviousForecast> = ({ syllabusId }) => {
  const subject = usePupilForecastStore((s) => s.subject);
  const copyPreviousForecast = usePupilForecastStore((s) => s.copyPreviousForecast);
  const [isOpen, setisOpen] = useState(false);
  const [summerPeriod, setSummerPeriod] = useState(false);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const allPeriods = usePupilForecastStore((s) => s.allPeriods);
  const currentDate = new Date();

  const message = useSnackbar();

  const openModalhandler = async () => {
    await setisOpen(true);
  };

  const onCloseHandler = () => {
    setisOpen(false);
  };

  useEffect(() => {
    if (
      currentDate >= new Date(`${new Date().getFullYear()}-07-01`) &&
      currentDate < new Date(allPeriods[allPeriods.length - 1].startDate) &&
      currentDate < new Date(selectedPeriod.startDate)
    ) {
      setSummerPeriod(true);
    } else {
      setSummerPeriod(false);
    }
  }, [selectedPeriod]);

  const onCopyHandler = async () => {
    if (subject[0].groupId) {
      const body: CopyPreviousForecastDto = {
        groupId: subject[0].groupId || '',
        syllabusId: syllabusId,
      };
      await copyPreviousForecast(body).then((res) => {
        if (!res.error) {
          message({
            message: `Prognosen sparades`,
            status: 'success',
          });
        } else {
          message({
            message: res.message,
            status: 'error',
          });
        }
      });
    }
  };

  let numberOfForecasts = 0;
  subject.forEach((s) => {
    if (s.forecast !== null) {
      numberOfForecasts++;
    }
  });

  useEffect(() => {
    if (
      currentDate >= new Date(`${new Date().getFullYear()}-07-01`) &&
      currentDate < new Date(allPeriods[allPeriods.length - 1].startDate) &&
      currentDate < new Date(selectedPeriod.startDate)
    ) {
      setSummerPeriod(true);
    } else {
      setSummerPeriod(false);
    }
  }, [selectedPeriod]);

  return summerPeriod ? (
    <></>
  ) : (
    <div>
      <Button size="md" onClick={openModalhandler} variant="secondary" leftIcon={<Icon name="copy-check" />}>
        Kopiera föregående prognos
      </Button>
      <Modal className="max-w-[420px] w-full" show={isOpen} onClose={onCloseHandler} label="Innan du fortsätter">
        <Modal.Content>
          <h1 className="text-h2-md">Vill du kopiera förra månadens prognoser för {subject[0]?.courseName}?</h1>
          {subject.find((x) => x.forecast !== null) ? (
            <p>
              Ifyllda prognoser för <strong>{numberOfForecasts} elever</strong> kommer att ersättas
            </p>
          ) : (
            <p>Inga prognoser finns ifyllda för nuvarande period</p>
          )}
        </Modal.Content>
        <Modal.Footer className="flex justify-between">
          <Button size="md" onClick={onCloseHandler} className="w-[48%]" variant="secondary" color="vattjom">
            Avbryt
          </Button>
          <Button onClick={onCopyHandler} className="w-[48%]" color="vattjom" variant="primary">
            Kopiera och ersätt
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
