'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, FormErrorMessage } from '@sk-web-gui/react';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { appURL } from '@utils/app-url';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  const isLoggedOut = searchParams.get('loggedout') === '';
  const failMessage = searchParams.get('failMessage');

  // Turn on/off automatic login
  const autoLogin = true;

  const initalFocus = useRef<HTMLButtonElement>(null);
  const setInitalFocus = () => {
    setTimeout(() => {
      initalFocus.current?.focus();
    });
  };

  const onLogin = () => {
    // NOTE: send user to login with SSO. External URL, so a full navigation rather than router.push.
    const path = searchParams.get('path') || '';
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/saml/login`);
    url.searchParams.set('successRedirect', `${appURL()}${path}`);
    url.searchParams.set('failureRedirect', `${appURL()}/login`);
    window.location.assign(url.toString());
  };

  useEffect(() => {
    setInitalFocus();
    setTimeout(() => setMounted(true), 500); // to not flash the login-screen on autologin
    if (isLoggedOut) {
      router.replace('/login');
    } else if (!failMessage && autoLogin) {
      // autologin
      onLogin();
    } else if (failMessage === 'SAML_MISSING_GROUP') {
      setErrorMessage('Användaren saknar rätt grupper');
    } else if (failMessage === 'SAML_MISSING_ATTRIBUTES') {
      setErrorMessage('Användaren saknar rätt attribut');
    } else if (failMessage === 'SAML_MISSING_PERMISSIONS') {
      setErrorMessage('Användaren saknar rättigheter');
    } else if (failMessage) {
      setErrorMessage(failMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted && !failMessage) {
    // to not flash the login-screen on autologin
    return <LoaderFullScreen />;
  }

  return (
    <EmptyLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Logga In`}>
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full flex flex-col text-light-primary bg-inverted-background-content p-20 shadow-lg text-left">
            <div className="mb-14">
              <h1 className="mb-10 text-xl">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
              <p className="my-0">Prognoser över elever - För lärare, mentorer, rektorer och elevhälsa</p>
            </div>

            <Button inverted onClick={() => onLogin()} ref={initalFocus} data-cy="loginButton">
              Logga in
            </Button>

            {errorMessage && <FormErrorMessage className="mt-lg">{errorMessage}</FormErrorMessage>}
          </div>
        </div>
      </main>
    </EmptyLayout>
  );
}
