import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { SubjectWithPupils } from '@components/subjects-groups/subject-with-pupils.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { useUserStore } from '@services/user-service/user-service';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
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
  const subId = routeId?.split('-syllabus-')[0];
  const syllabusId = routeId?.split('-syllabus-')[1];
  const singleSubjectIsLoading = usePupilForecastStore((s) => s.singleSubjectIsLoading);
  const getSubjectWithPupils = usePupilForecastStore((s) => s.getSubjectWithPupils);
  const getClasses = usePupilForecastStore((s) => s.getMyClasses);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  // const setSelectedSyllabus = usePupilForecastStore((s) => s.setSelectedSyllabus);
  const [pageTitle, setPageTitle] = useState<string>();

  const allSubjects = usePupilForecastStore((s) => s.mySubjects);
  const [riffleSubjects, setRiffleSubjects] = useState<Riffle[]>([]);

  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const [syllabus] = useState<string>(syllabusId ? syllabusId : '');
  const [subjectId] = useState(subId);

  const [selectedId, setSelectedId] = useState<string>();
  const [selectedSyllabus, setSelectedSyllabus] = useState<string>();

  //const currentPeriod = GR ? termPeriod : currentMonthPeriod;
  const subjectQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    const loadClass = async () => {
      if (subjectId && syllabusId) {
        if (router.pathname.includes(subjectId) && router.pathname.includes(syllabusId)) return;
        //await setSelectedPeriod(myGroup.period, myGroup.schoolYear, 'subjects');
        await getSubjectWithPupils(subjectId, syllabus, selectedPeriod.periodId);
        await getClasses(subjectQueries);
        setSelectedId(subjectId);
        setSelectedSyllabus(syllabusId);
        // await getPreviousPeriodGroup(subjectId, {
        //   period: previousPeriod,
        //   schoolYear: previousSchoolYear ?? currentYear - 1,
        // });
      } else {
        if (!subjectId) {
          router.push('/amnen-grupper');
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
  }, [router.query, router.isReady, selectedPeriod.periodId]);

  console.log(selectedSyllabus);

  useEffect(() => {
    if (selectedId && syllabus) {
      getClasses(subjectQueries);
      getSubjectWithPupils(selectedId, syllabus);
    }
  }, [selectedPeriod.periodId]);

  const breadcrumbLinks = [
    { link: '/amnen-grupper', title: 'Ämnen/grupper', currentPage: false },
    { link: '', title: pageTitle ? pageTitle : '...', currentPage: true },
  ];

  useEffect(() => {
    const riffleArray: Riffle[] = [];

    allSubjects.data.filter((s) => {
      riffleArray.push({
        id: s.groupId,
        link: `/amnen-grupper/amne-grupp/${s.groupId}-syllabus-${selectedSyllabus}`,
        title: `${s.groupName}`,
      });
    });

    setRiffleSubjects(riffleArray.sort((a, b) => a.title.localeCompare(b.title)));
  }, [allSubjects]);

  return (
    <DefaultLayout
      breadcrumbsIsLoading={singleSubjectIsLoading}
      breadcrumbLinks={breadcrumbLinks}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}
    >
      <Main>
        <SubjectWithPupils setPageTitle={setPageTitle} pageTitle={pageTitle ?? '...'} />
        <RifflePrevNext
          currentId={selectedId}
          riffleIsLoading={singleSubjectIsLoading}
          riffleObjects={riffleSubjects}
          callback="subject"
        />
      </Main>
    </DefaultLayout>
  );
};

export default Index;
