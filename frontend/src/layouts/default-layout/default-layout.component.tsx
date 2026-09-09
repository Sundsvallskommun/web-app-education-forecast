import Menu from '@components/menu/menu.component';
import { Skeleton } from '@components/skeleton/skeleton.component';
import { useUserStore } from '@services/user-service/user-service';
import { Breadcrumb, Header, Logo } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import Link from 'next/link';
import { useEffect } from 'react';

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
  const user = useUserStore((s) => s.user);
  const { headmaster } = hasRolePermission(user);

  const headerSubtitle = () => {
    if (headmaster) {
      return user.schools.every((s) => s.schoolName === user.schools[0].schoolName) ? user.schools[0].schoolName : '';
    } else {
      return user.schools[0].schoolName;
    }
  };
  const subtitle = headerSubtitle();
  const layoutTitle = subtitle
    ? `${process.env.NEXT_PUBLIC_APP_NAME} - ${subtitle}`
    : `${process.env.NEXT_PUBLIC_APP_NAME}`;
  const fullTitle = postTitle ? `${layoutTitle} - ${postTitle}` : `${layoutTitle}`;
  const documentTitle = title || fullTitle;

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  return (
    <div className="DefaultLayout full-page-layout">
      <Link href="#content" className="next-link-a" data-cy="systemMessage-a">
        Hoppa till innehåll
      </Link>

      <Header
        data-cy="nav-header"
        className="flex flex-wrap"
        title={headerTitle || process.env.NEXT_PUBLIC_APP_NAME}
        subtitle={headerSubtitle() || ''}
        aria-label={`${headerTitle || process.env.NEXT_PUBLIC_APP_NAME} ${headerSubtitle()}`}
        logo={
          <Link href={logoLinkHref}>
            <Logo title={headerTitle ?? process.env.NEXT_PUBLIC_APP_NAME} />
          </Link>
        }
        userMenu={<Menu />}
        mobileMenu={<Menu />}
      />

      {preContent && preContent}

      <div className={`main-container flex-grow relative w-full flex flex-col`}>
        {breadcrumbLinks && (
          <div className="w-full bg-vattjom-background-200 py-16 px-24">
            <Breadcrumb className="container">
              {breadcrumbLinks.map((crumb) => {
                return (
                  <Breadcrumb.Item currentPage={crumb.currentPage} key={`crumb-${crumb.link}-${crumb.title}`}>
                    {crumb.currentPage ? (
                      <Breadcrumb.Link>{crumb.title}</Breadcrumb.Link>
                    ) : (
                      <Link href={crumb.link}>{crumb.title}</Link>
                    )}
                  </Breadcrumb.Item>
                );
              })}
              {breadcrumbsIsLoading && (
                <Breadcrumb.Item>
                  <Skeleton className="w-80" />
                </Breadcrumb.Item>
              )}
            </Breadcrumb>
          </div>
        )}
        <div className="main-content-padding">{children}</div>
      </div>

      {postContent && postContent}
    </div>
  );
}
