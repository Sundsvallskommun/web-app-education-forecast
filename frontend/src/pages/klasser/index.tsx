import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { hasRolePermission } from '@utils/has-role-permission';
import { Classes } from '@components/classes/classes.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { headmaster } = hasRolePermission(user);
  const pageTitle = 'Klasser';
  //const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const getClasses = usePupilForecastStore((s) => s.getMyClasses);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const selectedSchool = useUserStore((s) => s.selectedSchool);

  //const currentPeriod = GR ? termPeriod : currentMonthPeriod;
  const classQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    !headmaster ? router.push('/mina-amnen-grupper') : getClasses(classQueries);
  }, [selectedPeriod.periodId]);
  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}>
      <Main>
        <Classes pageTitle={pageTitle} classQueries={classQueries} />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
