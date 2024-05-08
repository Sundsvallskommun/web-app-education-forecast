import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { SubjectWithPupils } from '@components/subjects-groups/subject-with-pupils.component';
import { QueriesDto } from '@interfaces/forecast/forecast';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import { formatPreviousPeriod } from '@utils/format-previous-period';
import { useUserStore } from '@services/user-service/user-service';
import { RifflePrevNext } from '@components/riffle-prev-next/riffle-prev-next.component';
import { hasRolePermission } from '@utils/has-role-permission';

export const Index: React.FC = () => {
  const router = useRouter();
  const routersubjectId = router.query['groupId'];
  const subjectId = routersubjectId && Array.isArray(routersubjectId) ? routersubjectId.pop() : null;
  const user = useUserStore((s) => s.user);
  const { GR, mentor, headmaster } = hasRolePermission(user);

  const getPreviousPeriodGroup = useForecastStore((s) => s.getPreviousPeriodGroup);
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const subjectIsLoading = useForecastStore((s) => s.groupWithPupilsIsLoading);
  const setSelectedPeriod = useForecastStore((s) => s.setSelectedPeriod);
  const [pageTitle, setPageTitle] = useState<string>();

  const allSubjects = useForecastStore((s) => s.mySubjects);
  const subjectsIsLoading = useForecastStore((s) => s.subjectsIsLoading);
  const [riffleSubjects, setRiffleSubjects] = useState([]);

  const { previousPeriod, previousSchoolYear } = formatPreviousPeriod(user, selectedPeriod, selectedSchoolYear);
  const currentPeriod = GR ? termPeriod : currentMonthPeriod;
  useEffect(() => {
    const myGroup: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };
    const loadClass = async () => {
      if (subjectId) {
        if (router.pathname.includes(subjectId)) return;
        mentor || (headmaster && (await setSelectedPeriod(myGroup.period, myGroup.schoolYear, 'classes')));
        await setSelectedPeriod(myGroup.period, myGroup.schoolYear, 'subjects');
        await setSelectedPeriod(myGroup.period, myGroup.schoolYear, 'subject', subjectId);
        await getPreviousPeriodGroup(subjectId, { period: previousPeriod, schoolYear: previousSchoolYear });
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
    { link: '', title: pageTitle, currentPage: true },
  ];

  useEffect(() => {
    const riffleArray = [];

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
        <SubjectWithPupils setPageTitle={setPageTitle} pageTitle={pageTitle} />
        {riffleSubjects.length > 1 && (
          <RifflePrevNext riffleIsLoading={subjectsIsLoading} riffleObjects={riffleSubjects} callback="subject" />
        )}
      </Main>
    </DefaultLayout>
  );
};

export default Index;
