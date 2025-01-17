import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ClassWithPupils } from '@components/classes/class-with-pupils.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { QueriesDto } from '@interfaces/forecast/forecast';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
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
  const routerclassId = router.query['groupId'];
  const user = useUserStore((s) => s.user);
  const { GR } = hasRolePermission(user);
  const classId = routerclassId && Array.isArray(routerclassId) ? routerclassId.pop() : null;
  const mentorClass = useForecastStore((s) => s.mentorClassGrid);
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);

  const classes = useForecastStore((s) => s.myClasses);
  const classesIsLoading = useForecastStore((s) => s.classesIsLoading);
  const [riffleClasses, setRiffleClasses] = useState<Riffle[]>([]);

  const currentPeriod = GR ? termPeriod : currentMonthPeriod;

  useEffect(() => {
    const myGroup: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };
    const loadClass = async () => {
      if (classId) {
        if (router.pathname.includes(classId)) return;
        await setSelectedPeriod(myGroup.period ?? selectedPeriod, myGroup.schoolYear, 'classes');
        await setSelectedPeriod(myGroup.period ?? selectedPeriod, myGroup.schoolYear, 'mentorclass', classId, user);
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
    const riffleArray: Riffle[] = [];

    classes.filter((c) => {
      riffleArray.push({
        id: c.groupId,
        link: `/klasser/klass/${c.groupId}`,
        title: `${c.groupName}`,
      });
    });

    setRiffleClasses(riffleArray.sort((a, b) => a.title.localeCompare(b.title)));
  }, [classes]);

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
      <Main>
        <ClassWithPupils />
        {riffleClasses.length > 1 ? (
          <RifflePrevNext riffleIsLoading={classesIsLoading} riffleObjects={riffleClasses} callback="mentorclass" />
        ) : (
          <></>
        )}
      </Main>
    </DefaultLayout>
  );
};

export default Index;
