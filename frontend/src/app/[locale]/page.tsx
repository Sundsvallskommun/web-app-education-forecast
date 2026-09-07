'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { hasRolePermission } from '@utils/has-role-permission';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

export default function Page() {
  const user = useUserStore((s) => s.user);
  const getMyClasses = usePupilForecastStore((s) => s.getMyClasses);
  const { headmaster, teacher, mentor } = hasRolePermission(user);
  const router = useRouter();

  const selectedSchool = useUserStore((s) => s.selectedSchool);

  const teacherAndMentorRoutes = () => {
    const myGroup: ForeacastQueriesDto = {
      schoolId: selectedSchool?.schoolId,
      OrderBy: 'GroupName',
      OrderDirection: 'ASC',
      PageSize: 10,
    };
    if (teacher || (mentor && teacher)) {
      router.push('/mina-amnen-grupper');
    } else if (mentor && !teacher) {
      getMyClasses(myGroup).then((res) => {
        if (res.data) {
          router.push(`/min-mentorsklass/${res.data.data[0]?.groupId}`);
        }
      });
    }
  };

  useEffect(() => {
    if (headmaster) {
      router.push('/klasser');
    } else {
      teacherAndMentorRoutes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LoaderFullScreen />;
}
