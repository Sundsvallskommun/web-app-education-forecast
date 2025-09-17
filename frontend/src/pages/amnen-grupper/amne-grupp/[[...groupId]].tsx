import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { SubjectWithPupils } from '@components/subjects-groups/subject-with-pupils.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { useUserStore } from '@services/user-service/user-service';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useSnackbar } from '@sk-web-gui/react';

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
  const geMySubjects = usePupilForecastStore((s) => s.getMySubjects);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const toastMessage = useSnackbar();
  const [pageTitle, setPageTitle] = useState<string>();

  const allSubjects = usePupilForecastStore((s) => s.mySubjects);
  const [riffleSubjects, setRiffleSubjects] = useState<Riffle[]>([]);

  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const [syllabus] = useState<string>(syllabusId ? syllabusId : '');
  const [subjectId] = useState(subId);

  const [selectedId, setSelectedId] = useState<string>();
  const [selectedSyllabus, setSelectedSyllabus] = useState<string>();

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
        await getSubjectWithPupils(subjectId, syllabus, selectedPeriod.periodId).catch(() => {
          toastMessage({
            message: 'Något gick fel vid hämtning av ämnet/gruppen',
            status: 'error',
          });
        });
        await geMySubjects(subjectQueries).catch(() => {
          toastMessage({
            message: 'Något gick fel vid hämtning av alla ämnen och grupper',
            status: 'error',
          });
        });
        setSelectedId(subjectId);
        setSelectedSyllabus(syllabusId);
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
  }, [router.query, router.isReady]);

  useEffect(() => {
    if (selectedId && syllabus) {
      geMySubjects(subjectQueries);
      getSubjectWithPupils(selectedId, syllabus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod.periodId, selectedSchool.schoolId]);

  const breadcrumbLinks = [
    { link: '/amnen-grupper', title: 'Ämnen/grupper', currentPage: false },
    { link: '', title: pageTitle ? pageTitle : '...', currentPage: true },
  ];

  useEffect(() => {
    const riffleArray: Riffle[] = [];

    allSubjects.data.filter((s) => {
      riffleArray.push({
        id: s.groupId,
        link: `/amnen-grupper/amne-grupp/${s.groupId}-syllabus-${s.syllabusId}`,
        title: `${s.groupName}`,
      });
    });

    setRiffleSubjects(riffleArray.sort((a, b) => a.title.localeCompare(b.title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSubjects]);

  return (
    <DefaultLayout
      breadcrumbsIsLoading={singleSubjectIsLoading}
      breadcrumbLinks={breadcrumbLinks}
      title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}`}
    >
      <Main>
        <SubjectWithPupils
          selectedSyllabus={selectedSyllabus}
          setPageTitle={setPageTitle}
          pageTitle={pageTitle ?? '...'}
        />
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
