import type { Metadata } from 'next';
import { Suspense } from 'react';
import AppLayout from './app-layout';
import i18nConfig from './i18nConfig';
import '@styles/tailwind.scss';

// Default metadata; app/[locale]/layout.tsx overrides title and description per path.
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_NAME,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={i18nConfig.defaultLocale}>
      <body>
        <Suspense>
          <AppLayout>{children}</AppLayout>
        </Suspense>
      </body>
    </html>
  );
}
