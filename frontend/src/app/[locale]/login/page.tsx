'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Icon } from '@sk-web-gui/react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { appURL } from '@utils/app-url';

export default function Page() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedOut = searchParams.has('loggedout');
  const failMessage = searchParams.get('failMessage');
  // A plain "not logged in" goes straight back through SSO; anything else shows the login page with the reason.
  const showLogin = isLoggedOut || (!!failMessage && failMessage !== 'NOT_AUTHORIZED');

  const initialFocus = useRef<HTMLButtonElement>(null);

  const onLogin = useCallback(() => {
    // NOTE: send user to login with SSO. External URL, so a full navigation rather than router.push.
    const searchPath = searchParams.get('path') || '';
    const path = searchPath.match(/\/login|\/logout/) ? '' : searchPath;
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/saml/login`);
    url.searchParams.set('successRedirect', `${appURL()}${path}`);
    url.searchParams.set('failureRedirect', `${appURL()}/login`);
    window.location.assign(url.toString());
  }, [searchParams]);

  useEffect(() => {
    if (!showLogin) {
      onLogin();
      return;
    }

    if (failMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage(t(`login:errors.${failMessage}`, { defaultValue: t('login:errors.SAML_UNKNOWN_ERROR') }));
    }
    setIsLoading(false);
  }, [showLogin, failMessage, onLogin, t]);

  useEffect(() => {
    if (!isLoading) initialFocus.current?.focus();
  }, [isLoading]);

  if (isLoading) {
    return <LoaderFullScreen />;
  }

  return (
    <EmptyLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Logga In`}>
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full flex flex-col text-light-primary bg-inverted-background-content p-20 shadow-lg text-left rounded-cards">
            <div className="mb-14">
              <h1 className="mb-10 text-xl">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
              <p className="my-0">{t('login:description')}</p>
            </div>

            <Button inverted onClick={onLogin} ref={initialFocus} data-cy="loginButton">
              {t('common:login')}
            </Button>

            {errorMessage && (
              <p className="flex gap-8 mt-lg text-inverted-error items-center" role="alert">
                <Icon icon={<Info />} size={21} /> {errorMessage}
              </p>
            )}
          </div>
        </div>
      </main>
    </EmptyLayout>
  );
}
