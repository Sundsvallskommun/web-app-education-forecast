import { SubjectsGroups } from '@components/subjects-groups/subjects-groups.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { headmaster } = hasRolePermission(user);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const getSubjects = usePupilForecastStore((s) => s.getMySubjects);

  const pageTitle = 'Ämnen/grupper';

  const subjectsQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    !headmaster ? router.push('/mina-amnen-grupper') : getSubjects(subjectsQueries);
  }, []);
  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}>
      <Main>
        <SubjectsGroups pageTitle={pageTitle} subjectsQueries={subjectsQueries} />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
