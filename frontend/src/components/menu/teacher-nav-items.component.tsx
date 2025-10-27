import { Icon, NavigationBar, PopupMenu } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useUserStore } from '@services/user-service/user-service';
import { ChevronDown } from 'lucide-react';

export const useTeacherNavItems = (): React.ReactNode[] => {
  const router = useRouter();
  const activeURL = router.pathname;
  const selectedSchool = useUserStore((state) => state.selectedSchool);
  const user = useUserStore((state) => state.user);
  const teacherLinks = [
    {
      label: 'Mina ämnen/grupper',
      url: `/mina-amnen-grupper/${selectedSchool.schoolId}`,
      current: activeURL.startsWith('/mina-amnen-grupper'),
      children:
        user?.schools.length < 2
          ? undefined
          : user.schools.map((school) => ({
              label: school.schoolName,
              url: `/mina-amnen-grupper/${school.schoolId}`,
            })),
    },
  ];

  return teacherLinks.map((link) => (
    <NavigationBar.Item current={link.current} key={`menyitem-${link.label}`}>
      {link.children ? (
        <PopupMenu>
          <PopupMenu.Button rightIcon={<Icon icon={<ChevronDown />} />}>{link.label}</PopupMenu.Button>
          <PopupMenu.Panel>
            <PopupMenu.Items>
              {link.children.map((childItem) => (
                <PopupMenu.Item key={childItem.label}>
                  <NextLink href={childItem.url}>{childItem.label}</NextLink>
                </PopupMenu.Item>
              ))}
            </PopupMenu.Items>
          </PopupMenu.Panel>
        </PopupMenu>
      ) : (
        <NextLink href={link.url}>{link.label}</NextLink>
      )}
    </NavigationBar.Item>
  ));
};
