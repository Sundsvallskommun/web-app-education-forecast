'use client';

import { Pupil } from '@components/pupils/pupil.component';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { useSnackbar } from '@sk-web-gui/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Riffle {
  id: string;
  link: string;
  title: string;
}

export default function Page() {
  const router = useRouter();
  const { pupil: pupilParam } = useParams<{ pupil?: string[] }>();
  const pupilId = pupilParam?.at(-1) ?? null;

  const pupil = usePupilForecastStore((s) => s.pupil);
  const singlePupilIsLoaded = usePupilForecastStore((s) => s.singlePupilIsLoaded);

  const getPupil = usePupilForecastStore((s) => s.getPupil);
  const getAllPupils = usePupilForecastStore((s) => s.getAllPupils);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);

  const allPupils = usePupilForecastStore((s) => s.allPupils);
  const pupilsIsLoaded = usePupilForecastStore((s) => s.pupilsIsLoaded);
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
    const loadPupil = async () => {
      if (pupilId) {
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
        router.push('/klasser');
      }
    };

    loadPupil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pupilId]);

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
  ];

  const currentBreadCrumblink = [
    {
      link: `/klasser/klass/elev/${pupil[0]?.pupil}`,
      title: `${pupil[0]?.givenname} ${pupil[0]?.lastname}`,
      currentPage: true,
    },
  ];

  return (
    <DefaultLayout
      breadcrumbLinks={[...breadcrumbLinks, ...(singlePupilIsLoaded ? currentBreadCrumblink : [])]}
      breadcrumbsIsLoading={!singlePupilIsLoaded}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - Elev ${pupil[0]?.givenname} ${pupil[0]?.lastname}`}
    >
      <Main>
        <Pupil />
        <RifflePrevNext
          currentId={selectedId}
          riffleIsLoading={!pupilsIsLoaded}
          riffleObjects={rifflePupils}
          callback="pupil"
        />
      </Main>
    </DefaultLayout>
  );
}
