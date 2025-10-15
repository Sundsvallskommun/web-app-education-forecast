import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ClassWithPupils } from '@components/classes/class-with-pupils.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useSnackbar } from '@sk-web-gui/react';

export const Index: React.FC = () => {
  const router = useRouter();
  const routerclassId = router.query['groupId'];
  const classId = routerclassId && Array.isArray(routerclassId) ? routerclassId.pop() : null;
  const getMentorClass = usePupilForecastStore((s) => s.getMentorClass);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const [selectedId, setSelectedId] = useState<string>();

  const toastMessage = useSnackbar();

  useEffect(() => {
    const loadClass = async () => {
      if (classId && classId !== undefined) {
        await getMentorClass(classId, selectedPeriod.periodId);
        setSelectedId(classId);
      } else {
        if (!classId) {
          router.push('/mina-amnen-grupper');
        }
      }
    };

    if (router.isReady) {
      loadClass();
    }

    router.events.on('routeChangeComplete', loadClass);
    return () => {
      router.events.off('routeChangeComplete', loadClass);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, router.isReady]);

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
};

export default Index;
