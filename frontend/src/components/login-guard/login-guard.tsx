'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const pathname = usePathname() ?? '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getMe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Routes by permissions
  const isForbidden =
    (pathname === '/mina-amnen-grupper' && !canViewMySubjectsGroups) ||
    (pathname === '/amnen-grupper' && !canViewAllSubjectsGroups) ||
    (pathname === '/min-mentorsklass' && !canViewMyMentorClass) ||
    (pathname === '/klasser' && !canViewAllClasses) ||
    (pathname === '/elever' && !canViewAllPupils);

  useEffect(() => {
    if (mounted && isForbidden) {
      router.push('/');
    }
  }, [mounted, isForbidden, router]);

  if (!mounted || (!user.name && !pathname.includes('/login')) || isForbidden) {
    return <LoaderFullScreen />;
  }

  return <>{children}</>;
};

export default LoginGuard;
