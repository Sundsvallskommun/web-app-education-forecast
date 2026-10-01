'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClassWithPupils } from '@components/classes/class-with-pupils.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useSnackbar } from '@sk-web-gui/react';

export default function Page() {
  const router = useRouter();
  const { groupId } = useParams<{ groupId?: string[] }>();
  const classId = groupId?.at(-1) ?? null;
  const getMentorClass = usePupilForecastStore((s) => s.getMentorClass);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const [selectedId, setSelectedId] = useState<string>();

  const toastMessage = useSnackbar();

  useEffect(() => {
    const loadClass = async () => {
      if (classId) {
        await getMentorClass(classId, selectedPeriod.periodId);
        setSelectedId(classId);
      } else {
        router.push('/mina-amnen-grupper');
      }
    };

    loadClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  useEffect(() => {
    if (selectedId) {
      getMentorClass(selectedId, selectedPeriod.periodId).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av din mentorsklass',
          status: 'error',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedPeriod.periodId]);

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Klass ${mentorClass[0]?.className}`}>
      <ClassWithPupils />
    </DefaultLayout>
  );
}
