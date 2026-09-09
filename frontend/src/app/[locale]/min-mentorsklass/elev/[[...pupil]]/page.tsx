'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { Pupil } from '@components/pupils/pupil.component';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
import { useUserStore } from '@services/user-service/user-service';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useSnackbar } from '@sk-web-gui/react';

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
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const singlePupilIsLoaded = usePupilForecastStore((s) => s.singlePupilIsLoaded);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const getPupil = usePupilForecastStore((s) => s.getPupil);
  const getMentorClass = usePupilForecastStore((s) => s.getMentorClass);

  const mentorclass = usePupilForecastStore((s) => s.mentorClass);
  const mentorclassIsLoaded = usePupilForecastStore((s) => s.mentorClassIsLoaded);
  const [rifflePupils, setRifflePupils] = useState<Riffle[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

  const toastMessage = useSnackbar();

  useEffect(() => {
    const loadPupil = async () => {
      if (pupilId) {
        await getPupil(selectedSchool.schoolId, pupilId, selectedPeriod.periodId).then(async (p) => {
          if (p.data) {
            await getMentorClass(p.data[0]?.classGroupId || '', selectedPeriod?.periodId);
          }
        });

        setSelectedId(pupilId);
      } else {
        router.push('/mina-amnen-grupper');
      }
    };

    loadPupil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pupilId]);

  useEffect(() => {
    if (selectedId && selectedPeriod) {
      getMentorClass(pupil[0]?.classGroupId || '', selectedPeriod?.periodId).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av din mentorsklass',
          status: 'error',
        });
      });
      getPupil(selectedSchool.schoolId, selectedId, selectedPeriod.periodId).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av eleven',
          status: 'error',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedPeriod.periodId]);

  const breadcrumbLinks = [
    { link: `/min-mentorsklass/${pupil[0]?.classGroupId}`, title: pupil[0]?.className ?? 'Klass', currentPage: false },
  ];
  const currentBreadcrumbLink = [
    { link: '', title: `${pupil[0]?.givenname} ${pupil[0]?.lastname}`, currentPage: true },
  ];

  useEffect(() => {
    const riffleArray: Riffle[] = [];
    mentorclass.filter((p) => {
      riffleArray.push({
        id: p.pupil,
        link: `/min-mentorsklass/elev/${p.pupil}`,
        title: `${p.givenname} ${p.lastname}`,
      });
    });

    setRifflePupils(riffleArray);
  }, [mentorclass]);

  return (
    <DefaultLayout
      breadcrumbsIsLoading={!singlePupilIsLoaded}
      breadcrumbLinks={[...breadcrumbLinks, ...(singlePupilIsLoaded ? currentBreadcrumbLink : [])]}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - Elev ${pupil[0]?.givenname} ${pupil[0]?.lastname}`}
    >
      <Main>
        <Pupil />
        <RifflePrevNext
          currentId={selectedId}
          riffleIsLoading={!mentorclassIsLoaded}
          riffleObjects={rifflePupils}
          callback="pupil"
        />
      </Main>
    </DefaultLayout>
  );
}
