'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedSchool = useUserStore((state) => state.selectedSchool);

  useEffect(() => {
    if (selectedSchool?.schoolId) {
      router.replace(`/mina-amnen-grupper/${selectedSchool.schoolId}`);
    } else if (user.schools[0]?.schoolId) {
      router.replace(`/mina-amnen-grupper/${user.schools[0].schoolId}`);
    }
  }, [router, selectedSchool?.schoolId, user.schools]);

  return <LoaderFullScreen />;
}
