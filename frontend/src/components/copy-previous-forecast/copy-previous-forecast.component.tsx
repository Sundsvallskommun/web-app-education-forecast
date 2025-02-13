import { Button, Icon, Modal, useSnackbar } from '@sk-web-gui/react';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { hasRolePermission } from '@utils/has-role-permission';
import { useUserStore } from '@services/user-service/user-service';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CopyPreviousForecastDto } from '@interfaces/forecast/forecast';

export const CopyPreviousForecast: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const subject = useForecastStore((s) => s.groupWithPupils);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedId = useForecastStore((s) => s.selectedId);
  const copyPreviousForecast = useForecastStore((s) => s.copyPreviousForecast);
  const { GR, GY } = hasRolePermission(user);
  const [isOpen, setisOpen] = useState(false);
  const [summerPeriod, setSummerPeriod] = useState(false);

  const message = useSnackbar();

  const monthPeriods = [
    'VT Januari',
    'VT Februari',
    'VT Mars',
    'VT April',
    'VT Maj',
    'HT September',
    'HT Oktober',
    'HT November',
    'HT December',
  ];

  const termPeriods = ['HT', 'VT'];
  let previousPeriod: string;
  let previousSchoolYear: number;

  if (GY) {
    monthPeriods[monthPeriods.indexOf(selectedPeriod)] === monthPeriods[0]
      ? (previousPeriod = monthPeriods[monthPeriods.length - 1])
      : (previousPeriod = monthPeriods[monthPeriods.indexOf(selectedPeriod) - 1]);

    monthPeriods.indexOf(previousPeriod) === monthPeriods.indexOf('VT Maj')
      ? (previousSchoolYear = selectedSchoolYear - 1)
      : (previousSchoolYear = selectedSchoolYear);
  } else if (GR) {
    termPeriods[termPeriods.indexOf(selectedPeriod)] === termPeriods[0]
      ? (previousPeriod = termPeriods[termPeriods.length - 1])
      : (previousPeriod = termPeriods[termPeriods.indexOf(selectedPeriod) - 1]);

    previousPeriod === 'VT' ? (previousSchoolYear = selectedSchoolYear - 1) : (previousSchoolYear = selectedSchoolYear);
  }

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
        period: selectedPeriod,
        previusPeriod: previousPeriod,
        schoolYear: selectedSchoolYear,
        previusSchoolYear: previousSchoolYear,
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
