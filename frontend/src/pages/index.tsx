import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { hasRolePermission } from '@utils/has-role-permission';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
import { QueriesDto } from '@interfaces/forecast/forecast';

export default function Index() {
  const user = useUserStore((s) => s.user, shallow);
  const { getMyClasses } = useForecastStore();
  const { headmaster, teacher, mentor } = hasRolePermission(user);
  const router = useRouter();
  const { schoolYear, currentMonthPeriod, termPeriod } = thisSchoolYearPeriod();
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);

  const { GR } = hasRolePermission(user);
  const currentPeriod = GR ? termPeriod : currentMonthPeriod;

  const teacherAndMentorRoutes = () => {
    const myGroup: QueriesDto = {
      period: selectedPeriod ? selectedPeriod : currentPeriod,
      schoolYear: selectedSchoolYear ? selectedSchoolYear : schoolYear,
    };
    if (teacher || (mentor && teacher)) {
      router.push('/mina-amnen-grupper');
    } else if (mentor && !teacher) {
      getMyClasses(myGroup).then((res) => {
        router.push(`/min-mentorsklass/${res.data[0]?.groupId}`);
      });
    }
  };

  useEffect(() => {
    headmaster ? router.push('/klasser') : teacherAndMentorRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LoaderFullScreen />;
}
