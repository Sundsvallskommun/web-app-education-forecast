import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ClassWithPupils } from '@components/classes/class-with-pupils.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { QueriesDto } from '@interfaces/forecast/forecast';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import { hasRolePermission } from '@utils/has-role-permission';
import { useUserStore } from '@services/user-service/user-service';

export const Index: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { GR, mentor } = hasRolePermission(user);
  const routerclassId = router.query['groupId'];
  const classId = routerclassId && Array.isArray(routerclassId) ? routerclassId.pop() : null;
  const mentorClass = useForecastStore((s) => (mentor ? s.mentorClassGrid : s.mentorClass));
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);

  const currentPeriod = GR ? termPeriod : currentMonthPeriod;

  useEffect(() => {
    const myGroup: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };
    const loadClass = async () => {
      if (classId) {
        if (router.pathname.includes(classId)) return;
        await setSelectedPeriod(myGroup.period ?? selectedPeriod, myGroup.schoolYear, 'mentorclass', classId, user);
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

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Klass ${mentorClass[0]?.className}`}>
      <ClassWithPupils />
    </DefaultLayout>
  );
};

export default Index;
