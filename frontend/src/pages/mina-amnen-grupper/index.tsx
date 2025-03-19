import { SubjectsGroups } from '@components/subjects-groups/subjects-groups.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';

import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { Spinner } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { teacher, mentor, headmaster } = hasRolePermission(user);
  const pageTitle = 'Mina ämnen/grupper';
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const getSubjects = usePupilForecastStore((s) => s.getMySubjects);
  const getMyClasses = usePupilForecastStore((s) => s.getMyClasses);

  const myGroup: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    if (teacher || (mentor && teacher)) {
      getSubjects(myGroup);
    } else if (mentor && !teacher) {
      getMyClasses(myGroup).then((res) => {
        res.data && router.push(`/min-mentorsklass/${res.data.data[0]?.groupId}`);
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
          <SubjectsGroups pageTitle={pageTitle} subjectsQueries={myGroup} />
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
