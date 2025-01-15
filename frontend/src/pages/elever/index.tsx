import { AllPupils } from '@components/pupils/all-pupils.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { QueriesDto } from '@interfaces/forecast/forecast';
import { thisSchoolYearPeriod } from '@utils/school-year-period';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { headmaster, GR } = hasRolePermission(user);
  const pageTitle = 'Elever';
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);

  const currentPeriod = GR ? termPeriod : currentMonthPeriod;

  useEffect(() => {
    const queries: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };

    !headmaster
      ? router.push('/mina-amnen-grupper')
      : setSelectedPeriod(queries.period as string, queries.schoolYear, 'pupils');
  });

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Elever`}>
      <Main>
        <AllPupils pageTitle={pageTitle} />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
