import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { Pupil } from '@components/pupils/pupil.component';
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
  const routerpupilId = router.query['pupil'];

  const pupilId = routerpupilId && Array.isArray(routerpupilId) ? routerpupilId.pop() : null;

  const pupil = usePupilForecastStore((s) => s.pupil);
  const singlePupilIsLoading = usePupilForecastStore((s) => s.singlePupilIsLoading);

  const getPupil = usePupilForecastStore((s) => s.getPupil);
  const getAllPupils = usePupilForecastStore((s) => s.getAllPupils);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);

  const allPupils = usePupilForecastStore((s) => s.allPupils);
  const pupilsIsLoading = usePupilForecastStore((s) => s.pupilsIsLoading);
  const [rifflePupils, setRifflePupils] = useState<Riffle[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

  const toastMessage = useSnackbar();

  const classQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 500,
  };

  useEffect(() => {
    const loadClass = async () => {
      if (pupilId) {
        if (router.pathname.includes(pupilId)) return;
        await getAllPupils(classQueries).catch(() => {
          toastMessage({
            message: 'Något gick fel vid hämtning av alla elever',
            status: 'error',
          });
        });
        await getPupil(selectedSchool.schoolId, pupilId, selectedPeriod.periodId).catch(() => {
          toastMessage({
            message: 'Något gick fel vid hämtning av eleven',
            status: 'error',
          });
        });
        setSelectedId(pupilId);
      } else {
        if (!pupilId) {
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
      getAllPupils(classQueries);
      getPupil(selectedSchool.schoolId, selectedId, selectedPeriod.periodId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedPeriod.periodId]);

  useEffect(() => {
    const riffleArray: Riffle[] = [];

    allPupils.data.filter((p) => {
      riffleArray.push({
        id: p.pupil ?? pupilId ?? '',
        link: `/klasser/klass/elev/${p.pupil}`,
        title: `${p.givenname} ${p.lastname}`,
      });
    });

    setRifflePupils(riffleArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPupils]);

  const breadcrumbLinks = [
    { link: '/klasser', title: 'Klasser', currentPage: false },
    {
      link: `/klasser/klass/${pupil[0]?.classGroupId}`,
      title: pupil[0]?.className ?? 'Elev',
      currentPage: false,
    },
    {
      link: `/klasser/klass/elev/${pupil[0]?.pupil}`,
      title: `${pupil[0]?.givenname} ${pupil[0]?.lastname}`,
      currentPage: true,
    },
  ];

  return (
    <DefaultLayout
      breadcrumbLinks={breadcrumbLinks}
      breadcrumbsIsLoading={singlePupilIsLoading}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - Elev ${pupil[0]?.givenname} ${pupil[0]?.lastname}}`}
    >
      <Main>
        <Pupil />
        <RifflePrevNext
          currentId={selectedId}
          riffleIsLoading={pupilsIsLoading}
          riffleObjects={rifflePupils}
          callback="pupil"
        />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
