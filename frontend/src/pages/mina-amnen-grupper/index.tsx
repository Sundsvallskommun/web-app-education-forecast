import { SubjectsGroups } from '@components/subjects-groups/subjects-groups.component';
import { QueriesDto } from '@interfaces/forecast/forecast';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useUserStore } from '@services/user-service/user-service';
import { Spinner } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { teacher, mentor, headmaster } = hasRolePermission(user);
  const { getMyClasses } = useForecastStore();
  const { GR } = hasRolePermission(user);
  const pageTitle = 'Mina ämnen/grupper';
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
    if (teacher || (mentor && teacher)) {
      setSelectedPeriod(myGroup.period ?? selectedPeriod, myGroup.schoolYear, 'subjects');
    } else if (mentor && !teacher) {
      getMyClasses(myGroup).then((res) => {
        res.data && router.push(`/min-mentorsklass/${res.data[0]?.groupId}`);
      });
    } else if (headmaster) {
      router.push('/amnen-grupper');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}>
      <Main>
        {teacher || (teacher && mentor) ? (
          <SubjectsGroups pageTitle={pageTitle} />
        ) : (
          <div className="max-w-[800px] w-full flex flex-col justify-center gap-16 m-0">
            <span className="text-2xl">Du har inte åtkomst till den här sidan och kommer omdirigeras</span>
            <Spinner size={6} />
          </div>
        )}
      </Main>
    </DefaultLayout>
  );
};

export default Index;
