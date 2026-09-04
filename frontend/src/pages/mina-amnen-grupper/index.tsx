import { useUserStore } from '@services/user-service/user-service';
import router from 'next/router';

export const Index = () => {
  const user = useUserStore((state) => state.user);
  const selectedSchool = useUserStore((state) => state.selectedSchool);

  if (selectedSchool?.schoolId) {
    router.push(`/mina-amnen-grupper/${selectedSchool.schoolId}`);
  } else {
    router.push(`/mina-amnen-grupper/${user.schools[0].schoolId}`);
  }
};

export default Index;
