import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { hasRolePermission } from '@utils/has-role-permission';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

export default function Index() {
  const user = useUserStore((s) => s.user, shallow);
  const { getMyClasses } = usePupilForecastStore();
  const { headmaster, teacher, mentor } = hasRolePermission(user);
  const router = useRouter();

  const selectedSchool = useUserStore((s) => s.selectedSchool);

  const teacherAndMentorRoutes = () => {
    const myGroup: ForeacastQueriesDto = {
      schoolId: selectedSchool.schoolId,
      OrderBy: 'GroupName',
      OrderDirection: 'ASC',
      PageSize: 10,
    };
    if (teacher || (mentor && teacher)) {
      router.push('/mina-amnen-grupper');
    } else if (mentor && !teacher) {
      getMyClasses(myGroup).then((res) => {
        res.data && router.push(`/min-mentorsklass/${res.data.data[0]?.groupId}`);
      });
    }
  };

  useEffect(() => {
    headmaster ? router.push('/klasser') : teacherAndMentorRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LoaderFullScreen />;
}
