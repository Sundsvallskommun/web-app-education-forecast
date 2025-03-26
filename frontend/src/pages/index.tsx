import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { hasRolePermission } from '@utils/has-role-permission';
import { ForeacastQueriesDto, Period } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

export interface SelectedPeriodForm {
  selectedPeriod: Period;
}

export default function Index() {
  const user = useUserStore((s) => s.user, shallow);
  const { getMyClasses } = usePupilForecastStore();
  const { headmaster, teacher, mentor } = hasRolePermission(user);
  const router = useRouter();
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const currentPeriod = usePupilForecastStore((s) => s.currentPeriod);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const classQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool.schoolId,
    periodId: selectedPeriod.periodId !== 0 ? selectedPeriod.periodId : currentPeriod.periodId,
    OrderBy: 'Givenname',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  // const teacherAndMentorRoutes = async () => {
  //   if (teacher || mentor) {
  //     router.push('/mina-amnen-grupper');
  //     // } else if (mentor && !teacher && classQueries.periodId) {
  //     //   await getMyClasses(classQueries).then((res) => {
  //     //     res.data && router.push(`/min-mentorsklass/${res.data.data[0]?.groupId}`);
  //     //   });
  //   }
  // };

  useEffect(() => {
    headmaster ? router.push('/klasser') : router.push('/mina-amnen-grupper');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoaderFullScreen />;
}
