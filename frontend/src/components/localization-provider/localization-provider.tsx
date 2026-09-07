'use client';

import initLocalization from '@app/i18n';
import { createInstance, Resource } from 'i18next';
import { memo, ReactNode, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';

interface LocalizationProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}

const LocalizationProvider = memo<LocalizationProviderProps>(({ children, locale, namespaces, resources }) => {
  const i18n = useMemo(() => {
    const instance = createInstance();
    initLocalization(locale, namespaces, instance, resources).catch((error: unknown) => {
      console.error('Failed to initialize localization.', error);
    });
    return instance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
});

LocalizationProvider.displayName = 'LocalizationProvider';
export default LocalizationProvider;
