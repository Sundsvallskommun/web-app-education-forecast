import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { hasRolePermission } from '@utils/has-role-permission';

export default function Index() {
  const user = useUserStore((s) => s.user, shallow);
  const { headmaster } = hasRolePermission(user);
  const router = useRouter();

  useEffect(() => {
    headmaster ? router.push('/klasser') : router.push('/mina-amnen-grupper');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LoaderFullScreen />;
}
