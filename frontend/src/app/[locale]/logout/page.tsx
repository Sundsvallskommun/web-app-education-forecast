'use client';

import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { appURL } from '@utils/app-url';
import { useEffect } from 'react';

export default function Page() {
  const { setDefaults } = useAppContext();
  const resetUser = useUserStore((s) => s.reset);

  useEffect(() => {
    setDefaults();
    resetUser();
    localStorage.clear();
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/saml/logout`);
    url.searchParams.set('successRedirect', `${appURL()}/login?loggedout`);
    window.location.assign(url.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
