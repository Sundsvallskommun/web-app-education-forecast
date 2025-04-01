import Menu from '@components/menu/menu.component';
import { useUserStore } from '@services/user-service/user-service';
import { CookieConsent, Header, Link, Spinner } from '@sk-web-gui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';
import { Breadcrumb } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';

interface DefaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  postTitle?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  logoLinkHref?: string;
  breadcrumbLinks?: Array<{
    link: string;
    title: string;
    currentPage: boolean;
  }>;
  breadcrumbsIsLoading?: boolean;
}

export default function DefaultLayout({
  title,
  postTitle,
  headerTitle,
  children,
  preContent = undefined,
  postContent = undefined,
  logoLinkHref = '/',
  breadcrumbLinks,
  breadcrumbsIsLoading,
}: DefaultLayoutProps) {
  const router = useRouter();

  const user = useUserStore((s) => s.user, shallow);
  const { headmaster } = hasRolePermission(user);

  const headerSubtitle = () => {
    if (headmaster) {
      return user.schools.every((s) => s.schoolName === user.schools[0].schoolName) ? user.schools[0].schoolName : '';
    } else {
      return user.schools[0].schoolName;
    }
  };
  const layoutTitle = `${process.env.NEXT_PUBLIC_APP_NAME}${headerSubtitle ? ` - ${headerSubtitle}` : ''}`;
  const fullTitle = postTitle ? `${layoutTitle} - ${postTitle}` : `${layoutTitle}`;

  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    contentElement?.focus();
  };

  const handleLogoClick = () => {
    router.push(logoLinkHref);
  };

  return (
    <div className="DefaultLayout full-page-layout">
      <Head>
        <title>{title ? title : fullTitle}</title>
        <meta name="description" content={`${process.env.NEXT_PUBLIC_APP_NAME}`} />
      </Head>

      <NextLink href="#content" legacyBehavior passHref>
        <a onClick={setFocusToMain} accessKey="s" className="next-link-a" data-cy="systemMessage-a">
          Hoppa till innehåll
        </a>
      </NextLink>

      <Header
        data-cy="nav-header"
        className="flex flex-wrap"
        title={headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME}
        subtitle={headerSubtitle() || ''}
        aria-label={`${headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME} ${headerSubtitle}`}
        logoLinkOnClick={handleLogoClick}
        userMenu={<Menu user={user} />}
        LogoLinkWrapperComponent={<NextLink legacyBehavior href={logoLinkHref} passHref />}
        mobileMenu={<Menu user={user} />}
      />

      {preContent && preContent}

      <div className={`main-container flex-grow relative w-full flex flex-col`}>
        {breadcrumbLinks && (
          <div className="w-full bg-vattjom-background-200 py-16 px-24">
            {!breadcrumbsIsLoading ? (
              <Breadcrumb className="container">
                {breadcrumbLinks.map((crumb) => {
                  return (
                    <Breadcrumb.Item currentPage={crumb.currentPage} key={`link-${crumb.link}`}>
                      <Breadcrumb.Link href={crumb.link}>{crumb.title}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
            ) : (
              <div className="container">
                <Spinner size={2} />
              </div>
            )}
          </div>
        )}
        <div className="main-content-padding">{children}</div>
      </div>

      {postContent && postContent}

      <CookieConsent
        title={`Kakor på ${process.env.NEXT_PUBLIC_APP_NAME}`}
        body={
          <p>
            Vi använder kakor, cookies, för att ge dig en förbättrad upplevelse, sammanställa statistik och för att viss
            nödvändig funktionalitet ska fungera på webbplatsen.{' '}
            <NextLink href="/kakor" passHref legacyBehavior>
              <Link>Läs mer om hur vi använder kakor</Link>
            </NextLink>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: 'Nödvändiga kakor',
            description:
              'Dessa kakor är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system.',
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: 'Funktionella kakor',
            description: ' Dessa kakor ger förbättrade funktioner på webbplatsen.',
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: 'Kakor för statistik',
            description:
              'Dessa kakor tillåter oss att räkna besök och trafikkällor, så att vi kan mäta och förbättra prestanda på vår webbplats.',
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => {
          // FIXME: do stuff with cookies?
          // NO ANO FUNCTIONS
        }}
      />
    </div>
  );
}
