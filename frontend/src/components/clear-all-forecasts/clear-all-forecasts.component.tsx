import { Button, Icon, Modal, useSnackbar } from '@sk-web-gui/react';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useState } from 'react';
import { clearGroupForecastsDto } from '@interfaces/forecast/forecast';

export const ClearAllForecasts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedId = useForecastStore((s) => s.selectedId);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const subject = useForecastStore((s) => s.groupWithPupils);
  const clearAll = useForecastStore((s) => s.clearGroupForecasts);

  const message = useSnackbar();

  const openModalHandler = () => {
    setIsOpen(true);
  };
  const onCloseHandler = () => {
    setIsOpen(false);
  };

  const clearAllHandler = () => {
    if (selectedId) {
      const body: clearGroupForecastsDto = {
        groupId: selectedId,
        period: selectedPeriod,
        schoolYear: selectedSchoolYear as number,
      };
      clearAll(body).then((res) => {
        if (!res.error) {
          message({
            message: `Prognoserna rensades bort`,
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

  return (
    <div className="max-medium-device:w-full">
      <Button
        className="max-medium-device:w-full"
        onClick={openModalHandler}
        variant="tertiary"
        size="md"
        leftIcon={<Icon name="trash-2" />}
      >
        Rensa alla
      </Button>
      <Modal className="max-w-[420px] w-full" show={isOpen} onClose={onCloseHandler} label="Innan du fortsätter">
        <Modal.Content>
          <h1 className="text-h2-md">Vill du rensa alla ifyllda prognoser för {subject[0]?.courseName}?</h1>
          <p>
            Ifyllda prognoser för <strong>{numberOfForecasts} elever</strong> kommer att raderas
          </p>
        </Modal.Content>
        <Modal.Footer className="flex justify-between">
          <Button size="md" onClick={onCloseHandler} className="w-[48%]" variant="secondary" color="vattjom">
            Avbryt
          </Button>
          <Button onClick={clearAllHandler} className="w-[48%]" color="error" variant="primary">
            Rensa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
