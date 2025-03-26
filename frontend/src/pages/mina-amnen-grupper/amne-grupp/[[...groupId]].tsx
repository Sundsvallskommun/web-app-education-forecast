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
  const subjectId = routeId?.split('-syllabus-')[0];
  const syllabusId = routeId?.split('-syllabus-')[1];
  const getSubjectWithPupils = usePupilForecastStore((s) => s.getSubjectWithPupils);
  const getSubjects = usePupilForecastStore((s) => s.getMySubjects);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const subjectsQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 500,
  };

  const subjectIsLoading = usePupilForecastStore((s) => s.singleSubjectIsLoading);
  const [pageTitle, setPageTitle] = useState<string>();

  const allSubjects = usePupilForecastStore((s) => s.mySubjects);
  const subjectsIsLoading = usePupilForecastStore((s) => s.subjectsIsLoading);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedSyllabus, setSelectedSyllabus] = useState<string>();
  const [riffleSubjects, setRiffleSubjects] = useState<Riffle[]>([]);

  useEffect(() => {
    const loadClass = async () => {
      if (subjectId && syllabusId) {
        if (router.pathname.includes(subjectId)) return;

        await getSubjects(subjectsQueries);
        await getSubjectWithPupils(subjectId, syllabusId);
        setSelectedId(subjectId);
        setSelectedSyllabus(syllabusId);
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

  useEffect(() => {
    if (selectedId && selectedSyllabus) {
      getSubjects(subjectsQueries);
      getSubjectWithPupils(selectedId, selectedSyllabus, selectedPeriod.periodId);
    }
  }, [selectedId, selectedSyllabus, selectedPeriod.periodId]);

  const breadcrumbLinks = [
    { link: '/mina-amnen-grupper', title: 'Mina ämnen/grupper', currentPage: false },
    { link: '', title: pageTitle ?? 'Ämne/grupp', currentPage: true },
  ];

  useEffect(() => {
    const riffleArray: Riffle[] = [];

    allSubjects.data.filter((s) => {
      riffleArray.push({
        id: s.groupId,
        link: `/mina-amnen-grupper/amne-grupp/${s.groupId}-syllabus-${s.syllabusId}`,
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
        <SubjectWithPupils
          selectedSyllabus={selectedSyllabus}
          setPageTitle={setPageTitle}
          pageTitle={pageTitle ?? 'Ämne'}
        />
        {riffleSubjects.length > 1 && (
          <RifflePrevNext
            currentId={selectedId}
            riffleIsLoading={subjectsIsLoading}
            riffleObjects={riffleSubjects}
            callback="subject"
          />
        )}
      </Main>
    </DefaultLayout>
  );
};

export default Index;
