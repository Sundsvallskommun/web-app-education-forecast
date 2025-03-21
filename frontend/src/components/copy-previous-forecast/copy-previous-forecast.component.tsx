import { Button, Icon, Modal, useSnackbar } from '@sk-web-gui/react';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CopyPreviousForecastDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

export const CopyPreviousForecast: React.FC = () => {
  const subject = usePupilForecastStore((s) => s.subject);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedId = useForecastStore((s) => s.selectedId);
  const copyPreviousForecast = useForecastStore((s) => s.copyPreviousForecast);
  const [isOpen, setisOpen] = useState(false);
  const [summerPeriod, setSummerPeriod] = useState(false);

  const message = useSnackbar();

  const openModalhandler = async () => {
    await setisOpen(true);
  };

  const onCloseHandler = () => {
    setisOpen(false);
  };

  const onCopyHandler = async () => {
    if (selectedId) {
      const body: CopyPreviousForecastDto = {
        groupId: selectedId,
        syllabusId: subject[0].syllabusId,
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
      (selectedPeriod === 'HT' || selectedPeriod === 'HT September') &&
      dayjs(new Date()).month() >= dayjs(new Date(new Date().getFullYear(), 5, 1)).month() &&
      dayjs(new Date()).month() < dayjs(new Date(new Date().getFullYear(), 7, 1)).month()
    ) {
      setSummerPeriod(true);
    } else {
      setSummerPeriod(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
