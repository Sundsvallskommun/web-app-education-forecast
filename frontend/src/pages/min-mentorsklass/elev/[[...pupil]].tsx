import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { Pupil } from '@components/pupils/pupil.component';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import { QueriesDto } from '@interfaces/forecast/forecast';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
import { hasRolePermission } from '@utils/has-role-permission';
import { useUserStore } from '@services/user-service/user-service';

interface Riffle {
  id: string;
  link: string;
  title: string;
}

export const Index: React.FC = () => {
  const router = useRouter();
  const routerpupilId = router.query['pupil'];
  const pupilId = routerpupilId && Array.isArray(routerpupilId) ? routerpupilId.pop() : null;
  const user = useUserStore((s) => s.user);
  const { GR, teacher } = hasRolePermission(user);
  const pupil = useForecastStore((s) => s.pupil);
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const singlePupilIsLoading = useForecastStore((s) => s.singlePupilIsLoading);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);

  const mentorclass = useForecastStore((s) => s.mentorClass);
  const mentorclassIsLoading = useForecastStore((s) => s.mentorClassIsLoading);
  const [rifflePupils, setRifflePupils] = useState<Riffle[]>([]);

  const currentPeriod = GR ? termPeriod : currentMonthPeriod;
  useEffect(() => {
    const myGroup: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };
    const loadClass = async () => {
      if (pupilId) {
        if (router.pathname.includes(pupilId)) return;
        teacher && (await setSelectedPeriod(myGroup.period as string, myGroup.schoolYear, 'subjects'));
        await setSelectedPeriod(myGroup.period as string, myGroup.schoolYear, 'pupil', pupilId);
      } else {
        if (!pupilId) {
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

  const breadcrumbLinks = [
    { link: `/min-mentorsklass/${pupil[0]?.classGroupId}`, title: pupil[0]?.className as string, currentPage: false },
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
      breadcrumbsIsLoading={singlePupilIsLoading}
      breadcrumbLinks={breadcrumbLinks}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - Elev ${pupil[0]?.givenname} ${pupil[0]?.lastname}}`}
    >
      <Main>
        <Pupil isSinglePupil />
        <RifflePrevNext
          riffleIsLoading={mentorclassIsLoading}
          dataId={pupil[0]?.pupil as string}
          riffleObjects={rifflePupils}
          callback="pupil"
        />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
