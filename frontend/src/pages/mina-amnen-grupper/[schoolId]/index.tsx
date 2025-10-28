import { SubjectsGroups } from '@components/subjects-groups/subjects-groups.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { Spinner, useSnackbar } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import router from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

export const Index: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { teacher, mentor, headmaster } = hasRolePermission(user);
  const pageTitle = 'Mina ämnen/grupper';
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const setSelectedSchool = useUserStore((s) => s.setSelectedSchool);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const getSubjects = usePupilForecastStore((s) => s.getMySubjects);
  const getMyClasses = usePupilForecastStore((s) => s.getMyClasses);
  const currentPeriod = usePupilForecastStore((s) => s.currentPeriod);
  const routerSchoolId = router.query['schoolId'];
  const schoolId = Array.isArray(routerSchoolId) ? routerSchoolId[0] : routerSchoolId;
  const toastMessage = useSnackbar();

  const myGroup: ForeacastQueriesDto = {
    schoolId: schoolId ?? '',
    periodId: selectedPeriod?.periodId === 0 ? currentPeriod.periodId : selectedPeriod?.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    if (schoolId) {
      if (user?.schools.map((school) => school.schoolId).includes(schoolId)) {
        if (selectedSchool.schoolId !== schoolId) {
          const newSchool = user.schools.find((school) => school.schoolId === routerSchoolId);
          if (newSchool) {
            setSelectedSchool(newSchool);
          } else {
            setSelectedSchool(user.schools[0]);
            router.push(`/mina-amnen-grupper/${user.schools[0].schoolId}`);
          }
        }
      } else if (selectedSchool.schoolId === schoolId) {
        setSelectedSchool(user.schools[0]);
        router.push(`/mina-amnen-grupper/${user.schools[0].schoolId}`);
      } else {
        router.push(`/mina-amnen-grupper/${selectedSchool.schoolId}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerSchoolId, schoolId]);

  useEffect(() => {
    if (myGroup) {
      if (teacher || (mentor && teacher)) {
        getSubjects(myGroup).catch(() => {
          toastMessage({
            message: 'Något gick fel vid hämtning av dina ämnen/grupper',
            status: 'error',
          });
        });
      } else if (mentor && !teacher) {
        getMyClasses(myGroup)
          .then((res) => {
            if (res.data) {
              router.push(`/min-mentorsklass/${res.data.data[0]?.groupId}`);
            }
          })
          .catch(() => {
            toastMessage({
              message: 'Något gick fel vid hämtning av din mentorsklass',
              status: 'error',
            });
          });
      } else if (headmaster) {
        router.push('/amnen-grupper');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myGroup]);

  const breadcrumbLinks =
    user.schools.length > 1
      ? [
          { link: '/mina-amnen-grupper', title: 'Mina ämnen/grupper', currentPage: false },
          {
            link: '',
            title: selectedSchool.schoolName,
            currentPage: true,
          },
        ]
      : undefined;

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`} breadcrumbLinks={breadcrumbLinks}>
      <Main>
        {!!teacher && !!myGroup ? (
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
