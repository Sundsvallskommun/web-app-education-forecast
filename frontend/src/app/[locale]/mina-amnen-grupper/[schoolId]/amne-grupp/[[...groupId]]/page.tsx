'use client';

import { useParams } from 'next/navigation';
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

export default function Page() {
  const { groupId, schoolId } = useParams<{ groupId?: string[]; schoolId: string }>();
  const selectedSchool = useUserStore((state) => state.selectedSchool);
  const setSelectedSchool = useUserStore((state) => state.setSelectedSchool);
  const { schools } = useUserStore((state) => state.user);
  const routeId = groupId?.at(-1) ?? null;
  const subjectId = routeId?.split('-syllabus-')[0];
  const syllabusId = routeId?.split('-syllabus-')[1];
  const getSubjectWithPupils = usePupilForecastStore((state) => state.getSubjectWithPupils);
  const getSubjects = usePupilForecastStore((state) => state.getMySubjects);
  const clearSubject = usePupilForecastStore((state) => state.clearSingleSubject);
  const selectedPeriod = usePupilForecastStore((state) => state.selectedPeriod);
  const subjectsQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 500,
  };

  const subjectIsLoaded = usePupilForecastStore((state) => state.singleSubjectIsLoaded);
  const [pageTitle, setPageTitle] = useState<string>();

  const allSubjects = usePupilForecastStore((state) => state.mySubjects);
  const subjectsIsLoaded = usePupilForecastStore((state) => state.subjectsIsLoaded);
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
    const loadSubject = async () => {
      if (subjectId && syllabusId) {
        clearSubject();
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

    if (selectedId !== subjectId) {
      loadSubject();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

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

  const breadcrumbDefaults = schools.length > 1 ? [breadCrumbMyGroups, breadCrumbSchool] : [breadCrumbMyGroups];

  const breadcrumbLinks = [
    ...breadcrumbDefaults,
    ...(subjectIsLoaded ? [{ link: '', title: pageTitle ?? 'Ämne/grupp', currentPage: true }] : []),
  ];

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
      breadcrumbsIsLoading={!subjectIsLoaded}
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
            riffleIsLoading={!subjectsIsLoaded}
            riffleObjects={riffleSubjects}
            callback="subject"
          />
        )}
      </Main>
    </DefaultLayout>
  );
}
