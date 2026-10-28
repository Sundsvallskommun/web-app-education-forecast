import LocalizationProvider from '@components/localization-provider/localization-provider';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

import i18nConfig from '../i18nConfig';
import initLocalization from '../i18n';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => i18nConfig.locales.map((locale) => ({ locale }));
export const dynamicParams = false;

// Every namespace listed here must exist in locales/<locale>/.
const namespaces = ['common', 'paths'];

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;
  const { resources } = await initLocalization(locale, namespaces);

  return <LocalizationProvider {...{ locale, resources, namespaces }}>{children}</LocalizationProvider>;
};

export const generateMetadata = async ({ params }: LocaleLayoutProps) => {
  const { locale } = await params;
  const { t } = await initLocalization(locale, namespaces);
  const rawPath = (await headers()).get('x-path');
  // The root path has no title of its own (it only redirects by role), so treat it as no path.
  const path = rawPath && rawPath !== '/' ? rawPath : null;

  // Fallback title for paths without an entry in paths.json: capitalised segments.
  const pathName = !path
    ? null
    : path
        .replace(/^\/?/, '')
        .split('/')
        .map((s) => `${s.substring(0, 1).toUpperCase()}${s.substring(1)}`.replace('-', ' '))
        .join(', ');

  const pageTitle = t(`paths:${path}.title`, { defaultValue: pathName });
  const title = path ? `${process.env.NEXT_PUBLIC_APP_NAME} - ${pageTitle}` : process.env.NEXT_PUBLIC_APP_NAME;
  const description = t(`paths:${path}.description`, { defaultValue: '' });

  return {
    title,
    description,
  };
};

export default LocaleLayout;
