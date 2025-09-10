import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ClassWithPupils } from '@components/classes/class-with-pupils.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
import { useUserStore } from '@services/user-service/user-service';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useSnackbar } from '@sk-web-gui/react';

interface Riffle {
  id: string;
  link: string;
  title: string;
}

export const Index: React.FC = () => {
  const router = useRouter();
  const routerclassId = router.query['groupId'];
  const classId = routerclassId && Array.isArray(routerclassId) ? routerclassId.pop() : null;

  const getClasses = usePupilForecastStore((s) => s.getMyClasses);
  const selectedSchool = useUserStore((s) => s.selectedSchool);

  const getMentorClass = usePupilForecastStore((s) => s.getMentorClass);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);

  const classes = usePupilForecastStore((s) => s.myClasses);
  const classesIsLoading = usePupilForecastStore((s) => s.classesIsLoading);
  const [riffleClasses, setRiffleClasses] = useState<Riffle[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

  const toastMessage = useSnackbar();

  const classQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    const loadClass = async () => {
      if (classId) {
        if (router.pathname.includes(classId)) return;
        setSelectedId(classId);
      } else {
        if (!classId) {
          router.push('/klasser');
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
      getClasses(classQueries).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av alla klasser',
          status: 'error',
        });
      });
      getMentorClass(selectedId, selectedPeriod.periodId).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av klassen',
          status: 'error',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedPeriod.periodId]);

  useEffect(() => {
    const riffleArray: Riffle[] = [];

    classes.data.filter((c) => {
      riffleArray.push({
        id: c.groupId,
        link: `/klasser/klass/${c.groupId}`,
        title: `${c.groupName}`,
      });
    });

    setRiffleClasses(riffleArray.sort((a, b) => a.title.localeCompare(b.title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes, selectedPeriod.periodId]);

  const breadcrumbLinks = [
    { link: '/klasser', title: 'Klasser', currentPage: false },
    {
      link: '',
      title: `${mentorClass[0]?.className ? `Klass ${mentorClass[0]?.className}` : '...'}`,
      currentPage: true,
    },
  ];

  return (
    <DefaultLayout
      breadcrumbLinks={breadcrumbLinks}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - Klass ${mentorClass[0]?.className}`}
    >
      <ClassWithPupils />
      {riffleClasses.length > 1 ? (
        <RifflePrevNext
          currentId={selectedId}
          riffleIsLoading={classesIsLoading}
          riffleObjects={riffleClasses}
          callback="mentorclass"
        />
      ) : (
        <></>
      )}
    </DefaultLayout>
  );
};

export default Index;
