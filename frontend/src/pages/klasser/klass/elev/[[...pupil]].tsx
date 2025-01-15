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
import { User } from '@interfaces/user';

interface Riffle {
  id: string;
  link: string;
  title: string;
}

export const Index: React.FC = () => {
  const router = useRouter();
  const routerpupilId = router.query['pupil'];
  const user = useUserStore((s) => s.user as User);
  const { GR } = hasRolePermission(user);
  const pupilId = routerpupilId && Array.isArray(routerpupilId) ? routerpupilId.pop() : null;
  const pupil = useForecastStore((s) => s.pupil);
  const singlePupilIsLoading = useForecastStore((s) => s.singlePupilIsLoading);
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);

  const allPupils = useForecastStore((s) => s.allPupils);
  const pupilsIsLoading = useForecastStore((s) => s.pupilsIsLoading);
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
        await setSelectedPeriod(myGroup.period as string, myGroup.schoolYear, 'pupils');
        await setSelectedPeriod(myGroup.period as string, myGroup.schoolYear, 'pupil', pupilId);
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
    const riffleArray: Riffle[] = [];

    allPupils.filter((p) => {
      riffleArray.push({
        id: p.pupil as string,
        link: `/klasser/klass/elev/${p.pupil}`,
        title: `${p.givenname} ${p.lastname}`,
      });
    });

    setRifflePupils(riffleArray);
  }, [allPupils]);

  const breadcrumbLinks = [
    { link: '/klasser', title: 'Klasser', currentPage: false },
    { link: `/klasser/klass/${pupil[0]?.classGroupId}`, title: pupil[0]?.className as string, currentPage: false },
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
        <Pupil isSinglePupil />
        <RifflePrevNext riffleIsLoading={pupilsIsLoading} riffleObjects={rifflePupils} callback="pupil" />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
