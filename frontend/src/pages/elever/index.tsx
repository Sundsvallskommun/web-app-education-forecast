import { AllPupils } from '@components/pupils/all-pupils.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { headmaster } = hasRolePermission(user);
  const pageTitle = 'Elever';
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const getAllPupils = usePupilForecastStore((s) => s.getAllPupils);

  const pupilsQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'Givenname',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    !headmaster ? router.push('/mina-amnen-grupper') : getAllPupils(pupilsQueries);
  }, [selectedPeriod.periodId]);

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Elever`}>
      <Main>
        <AllPupils pageTitle={pageTitle} pupilsQueries={pupilsQueries} />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
