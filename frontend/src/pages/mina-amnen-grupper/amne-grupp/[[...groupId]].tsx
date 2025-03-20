import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { SubjectWithPupils } from '@components/subjects-groups/subject-with-pupils.component';
import { ForeacastQueriesDto, QueriesDto } from '@interfaces/forecast/forecast';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import { useUserStore } from '@services/user-service/user-service';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
import { hasRolePermission } from '@utils/has-role-permission';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

interface Riffle {
  id: string;
  link: string;
  title: string;
}

export const Index: React.FC = () => {
  const router = useRouter();
  const routersubjectId = router.query['groupId'];
  const routeId = routersubjectId && Array.isArray(routersubjectId) ? routersubjectId.pop() : null;
  const subjectId = routeId?.split('-syllabus-')[0];
  const syllabusId = routeId?.split('-syllabus-')[1];
  const getSubjectWithPupils = usePupilForecastStore((s) => s.getSubjectWithPupils);
  const getSubjects = usePupilForecastStore((s) => s.getMySubjects);
  const user = useUserStore((s) => s.user);
  const { GR, mentor, headmaster } = hasRolePermission(user);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const subjectsQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const subjectIsLoading = usePupilForecastStore((s) => s.singlePupilIsLoading);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);
  const [pageTitle, setPageTitle] = useState<string>();

  const allSubjects = useForecastStore((s) => s.mySubjects);
  const subjectsIsLoading = useForecastStore((s) => s.subjectsIsLoading);
  const [riffleSubjects, setRiffleSubjects] = useState<Riffle[]>([]);

  const currentPeriod = GR ? termPeriod : currentMonthPeriod;
  useEffect(() => {
    const myGroup: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };
    const loadClass = async () => {
      if (subjectId && syllabusId) {
        if (router.pathname.includes(subjectId)) return;
        mentor ||
          (headmaster && (await setSelectedPeriod(myGroup.period ?? selectedPeriod, myGroup.schoolYear, 'classes')));
        await getSubjects(subjectsQueries);
        await getSubjectWithPupils(subjectId, syllabusId);
        // await getPreviousPeriodGroup(subjectId, {
        //   period: previousPeriod,
        //   schoolYear: previousSchoolYear ?? currentYear - 1,
        // });
      } else {
        if (!subjectId) {
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

  const breadcrumbLinks = [
    { link: '/mina-amnen-grupper', title: 'Mina ämnen/grupper', currentPage: false },
    { link: '', title: pageTitle ?? 'Ämne/grupp', currentPage: true },
  ];

  useEffect(() => {
    const riffleArray: Riffle[] = [];

    allSubjects.filter((s) => {
      riffleArray.push({
        id: s.groupId,
        link: `/amnen-grupper/amne-grupp/${s.groupId}`,
        title: `${s.groupName}`,
      });
    });

    setRiffleSubjects(riffleArray.sort((a, b) => a.title.localeCompare(b.title)));
  }, [allSubjects]);

  return (
    <DefaultLayout
      breadcrumbsIsLoading={subjectIsLoading}
      breadcrumbLinks={breadcrumbLinks}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}
    >
      <Main>
        <SubjectWithPupils setPageTitle={setPageTitle} pageTitle={pageTitle ?? selectedPeriod} />
        {riffleSubjects.length > 1 && (
          <RifflePrevNext riffleIsLoading={subjectsIsLoading} riffleObjects={riffleSubjects} callback="subject" />
        )}
      </Main>
    </DefaultLayout>
  );
};

export default Index;
