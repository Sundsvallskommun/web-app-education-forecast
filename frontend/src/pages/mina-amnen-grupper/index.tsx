import { SubjectsGroups } from '@components/subjects-groups/subjects-groups.component';
import { QueriesDto } from '@interfaces/forecast/forecast';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { teacher, mentor } = hasRolePermission(user);
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
    if (teacher || mentor) {
      setSelectedPeriod(myGroup.period, myGroup.schoolYear, 'subjects');
    } else {
      router.push('/amnen-grupper');
    }
  }, []);
  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}>
      <Main>
        <SubjectsGroups pageTitle={pageTitle} />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
