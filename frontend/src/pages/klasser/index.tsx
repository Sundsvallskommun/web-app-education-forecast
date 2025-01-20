import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { hasRolePermission } from '@utils/has-role-permission';
import { Classes } from '@components/classes/classes.component';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { QueriesDto } from '@interfaces/forecast/forecast';
import { thisSchoolYearPeriod } from '@utils/school-year-period';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);
  const { headmaster, GR } = hasRolePermission(user);
  const pageTitle = 'Klasser';
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();

  const currentPeriod = GR ? termPeriod : currentMonthPeriod;

  useEffect(() => {
    const myGroup: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };
    !headmaster
      ? router.push('/mina-amnen-grupper')
      : setSelectedPeriod(myGroup.period ?? selectedPeriod, myGroup.schoolYear, 'classes');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}>
      <Main>
        <Classes pageTitle={pageTitle} />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
