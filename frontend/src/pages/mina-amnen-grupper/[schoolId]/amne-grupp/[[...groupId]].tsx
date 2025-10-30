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
  const routerSchoolId = router.query['schoolId'];
  const schoolId = Array.isArray(routerSchoolId) ? routerSchoolId[0] : (routerSchoolId as string);
  const selectedSchool = useUserStore((state) => state.selectedSchool);
  const setSelectedSchool = useUserStore((state) => state.setSelectedSchool);
  const { schools } = useUserStore((state) => state.user);
  const routeId = routersubjectId && Array.isArray(routersubjectId) ? routersubjectId.pop() : null;
  const subjectId = routeId?.split('-syllabus-')[0];
  const syllabusId = routeId?.split('-syllabus-')[1];
  const getSubjectWithPupils = usePupilForecastStore((state) => state.getSubjectWithPupils);
  const getSubjects = usePupilForecastStore((state) => state.getMySubjects);
  const selectedPeriod = usePupilForecastStore((state) => state.selectedPeriod);
  const subjectsQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 500,
  };

  const subjectIsLoading = usePupilForecastStore((state) => state.singleSubjectIsLoading);
  const [pageTitle, setPageTitle] = useState<string>();

  const allSubjects = usePupilForecastStore((state) => state.mySubjects);
  const subjectsIsLoading = usePupilForecastStore((state) => state.subjectsIsLoading);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedSyllabus, setSelectedSyllabus] = useState<string>();
  const [riffleSubjects, setRiffleSubjects] = useState<Riffle[]>([]);

  const toastMessage = useSnackbar();

  useEffect(() => {
    if (selectedSchool.schoolId !== schoolId) {
      const newSchool = schools.find((school) => school.schoolId === schoolId);
      if (newSchool) {
        setSelectedSchool(newSchool);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  useEffect(() => {
    const loadClass = async () => {
      if (subjectId && syllabusId) {
        if (router.pathname.includes(subjectId)) return;

        await getSubjects(subjectsQueries).catch(() => {
          toastMessage({
            message: 'Något gick fel vid hämtning av alla dina ämnen/grupper',
            status: 'error',
          });
        });
        await getSubjectWithPupils(subjectId, syllabusId).catch(() => {
          toastMessage({
            message: 'Något gick fel vid hämtning av ämnet/gruppen',
            status: 'error',
          });
        });
        setSelectedId(subjectId);
        setSelectedSyllabus(syllabusId);
      }
    };

    if (router.isReady && selectedId !== subjectId) {
      loadClass();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, subjectId]);

  useEffect(() => {
    if (selectedId && selectedSyllabus) {
      getSubjects(subjectsQueries).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av alla dina ämnen/grupper',
          status: 'error',
        });
      });
      getSubjectWithPupils(selectedId, selectedSyllabus, selectedPeriod.periodId).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av ämnet/gruppen',
          status: 'error',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedSyllabus, selectedPeriod.periodId]);

  const breadCrumbMyGroups = { link: '/mina-amnen-grupper', title: 'Mina ämnen/grupper', currentPage: false };
  const breadCrumbSchool = {
    link: `/mina-amnen-grupper/${selectedSchool.schoolId}`,
    title: selectedSchool.schoolName,
    currentPage: false,
  };

  const breadcrumbLinks =
    schools.length > 1
      ? [breadCrumbMyGroups, breadCrumbSchool, { link: '', title: pageTitle ?? 'Ämne/grupp', currentPage: true }]
      : [breadCrumbMyGroups, { link: '', title: pageTitle ?? 'Ämne/grupp', currentPage: true }];

  useEffect(() => {
    const riffleArray: Riffle[] = [];

    allSubjects.data.filter((subject) => {
      riffleArray.push({
        id: subject.groupId,
        link: `/mina-amnen-grupper/${selectedSchool.schoolId}/amne-grupp/${subject.groupId}-syllabus-${subject.syllabusId}`,
        title: `${subject.groupName}`,
      });
    });

    setRiffleSubjects(riffleArray.toSorted((a, b) => a.title.localeCompare(b.title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
