import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { hasRolePermission } from '@utils/has-role-permission';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const getMe = useUserStore((s) => s.getMe);
  const {
    canViewAllSubjectsGroups,
    canViewMySubjectsGroups,
    canViewMyMentorClass,
    canViewAllClasses,
    canViewAllPupils,
  } = hasRolePermission(user);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getMe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || (!user.name && !router.pathname.includes('/login'))) {
    return <LoaderFullScreen />;
  }

  // Routes by permissions
  if (
    (router.pathname == '/mina-amnen-grupper' && !canViewMySubjectsGroups) ||
    (router.pathname == '/amnen-grupper' && !canViewAllSubjectsGroups) ||
    (router.pathname == '/min-mentorsklass' && !canViewMyMentorClass) ||
    (router.pathname == '/klasser' && !canViewAllClasses) ||
    (router.pathname == '/elever' && !canViewAllPupils)
  ) {
    router.push('/');
    return <LoaderFullScreen />;
  }

  return <>{children}</>;
};

export default LoginGuard;
