import { useUserStore } from '@services/user-service/user-service';
import router from 'next/router';
import { shallow } from 'zustand/shallow';

export const Index = () => {
  const user = useUserStore((state) => state.user, shallow);
  const selectedSchool = useUserStore((state) => state.selectedSchool, shallow);

  if (selectedSchool?.schoolId) {
    router.push(`/mina-amnen-grupper/${selectedSchool.schoolId}`);
  } else {
    router.push(`/mina-amnen-grupper/${user.schools[0].schoolId}`);
  }
};

export default Index;
