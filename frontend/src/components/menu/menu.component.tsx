import { Icon, Link, MenuBar, PopupMenu } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { User } from '@interfaces/user';
import { hasRolePermission } from '@utils/has-role-permission';
import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';

interface MenuProps {
  user: User;
}

export const Menu: React.FC<MenuProps> = ({ user }) => {
  const router = useRouter();
  const { getMyClasses, myClasses } = usePupilForecastStore();
  const { headmaster, mentor, teacher } = hasRolePermission(user);
  const [activeURL, setActiveURL] = useState('/');
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);

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
      getMyClasses(classesQueries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod?.periodId]);

  const Usermenu = (
    <PopupMenu>
      <PopupMenu.Button leftIcon={<Icon name="user" />}>
        <span className="ml-4">{user.name}</span>
      </PopupMenu.Button>
      <PopupMenu.Panel className="w-full mt-xl">
        <PopupMenu.Item>
          <NextLink href="/logout">
            {' '}
            <Icon name="log-out" />
            Logga ut
          </NextLink>
        </PopupMenu.Item>
      </PopupMenu.Panel>
    </PopupMenu>
  );
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
    <MenuBar className="flex-wrap justify-end" color="vattjom">
      {headMasterlinks.map((link) => {
        return (
          <MenuBar.Item current={link.url === activeURL} key={`menyitem-${link.label}`}>
            <NextLink href={link.url}>{link.label}</NextLink>
          </MenuBar.Item>
        );
      })}
      <MenuBar.Item
        className="flex justify-end ml-32 max-phone-max:order-first max-phone-max:w-full"
        key={`menyitem-user-${user.name}`}
      >
        {Usermenu}
      </MenuBar.Item>
    </MenuBar>
  ) : (
    <MenuBar className="flex-wrap justify-end" color="vattjom">
      {teacherLinks.map((link) => {
        return (
          teacher && (
            <MenuBar.Item current={link.url === activeURL} key={`menyitem-${link.label}`}>
              <NextLink href={link.url}>{link.label}</NextLink>
            </MenuBar.Item>
          )
        );
      })}
      {mentor ? (
        <MenuBar.Item>
          <PopupMenu>
            <PopupMenu.Button rightIcon={<Icon name="chevron-down" />}>Klasser</PopupMenu.Button>
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
        </MenuBar.Item>
      ) : (
        <></>
      )}
      <MenuBar.Item className="flex justify-end ml-32 max-phone-max:order-first max-phone-max:w-full">
        {Usermenu}
      </MenuBar.Item>
    </MenuBar>
  );
};

export default Menu;
