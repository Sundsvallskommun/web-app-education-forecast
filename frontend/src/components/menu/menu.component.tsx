import { UserMenu } from '@components/user-menu/user-menu.component';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { Icon, Link, NavigationBar, PopupMenu, useSnackbar } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { ChevronDown } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

export const Menu: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const router = useRouter();
  const { getMyClasses, myClasses } = usePupilForecastStore();
  const { headmaster, mentor, teacher } = hasRolePermission(user);
  const [activeURL, setActiveURL] = useState('/');
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const setSelectedSchool = useUserStore((s) => s.setSelectedShool);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const [headmasterSchools, setHeadMasterSchools] = useState<{ schoolId: string; schoolName: string }[]>();

  const toastMessage = useSnackbar();

  const classesQueries: ForeacastQueriesDto = {
    schoolId: selectedSchool?.schoolId,
    periodId: selectedPeriod?.periodId,
    OrderBy: 'GroupName',
    OrderDirection: 'ASC',
    PageSize: 10,
  };

  useEffect(() => {
    setActiveURL(router.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  useEffect(() => {
    if (mentor) {
      getMyClasses(classesQueries).catch(() => {
        toastMessage({
          message: 'Något gick fel vid hämtning av alla klasser',
          status: 'error',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod?.periodId]);

  useEffect(() => {
    const schools: { schoolId: string; schoolName: string }[] = [];

    if (user) {
      user.schools.forEach((s) => {
        if (!schools.find((x) => x.schoolId === s.schoolId)) {
          schools.push({ schoolId: s.schoolId, schoolName: s.schoolName });
        }
      });
    }

    setHeadMasterSchools(schools);
  }, [user]);

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
  const teacherLinks = [
    {
      label: 'Mina ämnen/grupper',
      url: '/mina-amnen-grupper',
    },
  ];

  return headmaster ? (
    <NavigationBar className="flex-wrap justify-end" color="vattjom">
      {headMasterlinks.map((link) => {
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
      })}
      <NavigationBar.Item
        className="flex justify-end ml-32 max-phone-max:order-first max-phone-max:w-full"
        key={`menyitem-user-${user.name}`}
      >
        <UserMenu />
      </NavigationBar.Item>
    </NavigationBar>
  ) : (
    <NavigationBar className="flex-wrap justify-end" color="vattjom">
      {teacherLinks.map((link) => {
        return (
          teacher && (
            <NavigationBar.Item current={link.url === activeURL} key={`menyitem-${link.label}`}>
              <NextLink href={link.url}>{link.label}</NextLink>
            </NavigationBar.Item>
          )
        );
      })}
      {mentor ? (
        <NavigationBar.Item current={activeURL.includes('min-mentorsklass') || activeURL.includes('klasser')}>
          <PopupMenu>
            <PopupMenu.Button rightIcon={<Icon icon={<ChevronDown />} />}>Klasser</PopupMenu.Button>
            <PopupMenu.Panel className="w-full">
              {myClasses.data.map((classlink) => {
                return (
                  <PopupMenu.Item key={`popupmenyitem-${classlink.groupName}`}>
                    <Link onClick={() => router.push(`/min-mentorsklass/${classlink.groupId}`)}>
                      {classlink.groupName}
                    </Link>
                  </PopupMenu.Item>
                );
              })}
            </PopupMenu.Panel>
          </PopupMenu>
        </NavigationBar.Item>
      ) : (
        <></>
      )}
      <NavigationBar.Item className="flex justify-end ml-32 max-phone-max:order-first max-phone-max:w-full">
        <UserMenu />
      </NavigationBar.Item>
    </NavigationBar>
  );
};

export default Menu;
