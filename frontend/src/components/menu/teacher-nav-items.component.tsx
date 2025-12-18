import { Icon, NavigationBar, PopupMenu } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import { useUserStore } from '@services/user-service/user-service';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

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
              {link.children.map((childItem, index) => (
                <PopupMenu.Item key={childItem.label}>
                  <Link href={childItem.url} data-cy={`popup-menu-item-${index}-link`}>
                    {childItem.label}
                  </Link>
                </PopupMenu.Item>
              ))}
            </PopupMenu.Items>
          </PopupMenu.Panel>
        </PopupMenu>
      ) : (
        <Link href={link.url}>{link.label}</Link>
      )}
    </NavigationBar.Item>
  ));
};
