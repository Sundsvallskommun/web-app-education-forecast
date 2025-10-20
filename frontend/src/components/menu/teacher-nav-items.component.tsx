import { NavigationBar } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export const TeacherNavItems = (): React.ReactElement => {
  const router = useRouter();
  const activeURL = router.pathname;

  const teacherLinks = [
    {
      label: 'Mina ämnen/grupper',
      url: '/mina-amnen-grupper',
    },
  ];

  return (
    <>
      {teacherLinks.map((link) => (
        <NavigationBar.Item current={link.url === activeURL} key={`menyitem-${link.label}`}>
          <NextLink href={link.url}>{link.label}</NextLink>
        </NavigationBar.Item>
      ))}
    </>
  );
};
