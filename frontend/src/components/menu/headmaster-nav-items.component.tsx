import { useUserStore } from '@services/user-service/user-service';
import { Icon, Link, NavigationBar, PopupMenu } from '@sk-web-gui/react';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import NextLink from 'next/link';

type School = { schoolId: string; schoolName: string };

const headMasterlinks = [
  {
    label: 'Klasser',
    url: '/klasser',
  },
  {
    label: 'Ämnen/grupper',
    url: '/amnen-grupper',
  },
  {
    label: 'Elever',
    url: '/elever',
  },
];

export const useHeadmasterNav = (): React.ReactNode[] => {
  const router = useRouter();
  const activeURL = usePathname();

  const user = useUserStore((s) => s.user);
  const setSelectedSchool = useUserStore((s) => s.setSelectedSchool);

  const headmasterSchools: School[] = useMemo(() => {
    const uniq: Record<string, School> = {};
    if (user?.schools) {
      for (const s of user.schools) uniq[s.schoolId] = { schoolId: s.schoolId, schoolName: s.schoolName };
    }
    return Object.values(uniq);
  }, [user]);

  return [
    headMasterlinks.map((link, index) => {
      return (
        <NavigationBar.Item current={link.url === activeURL} key={`menyitem-${link.label}`}>
          {headmasterSchools && headmasterSchools.length > 1 ? (
            <PopupMenu>
              <PopupMenu.Button rightIcon={<Icon icon={<ChevronDown />} />}>{link.label}</PopupMenu.Button>
              <PopupMenu.Panel>
                {headmasterSchools.map((s) => {
                  return (
                    <PopupMenu.Item key={`popupmenyitem-${s.schoolId}`}>
                      <Link
                        onClick={async () => {
                          setSelectedSchool(s);
                          await router.push(link.url);
                        }}
                        data-cy={`popup-${index}-link-item-${s.schoolId}`}
                      >
                        {s.schoolName}
                      </Link>
                    </PopupMenu.Item>
                  );
                })}
              </PopupMenu.Panel>
            </PopupMenu>
          ) : (
            <NextLink href={link.url}>{link.label}</NextLink>
          )}
        </NavigationBar.Item>
      );
    }),
  ];
};
