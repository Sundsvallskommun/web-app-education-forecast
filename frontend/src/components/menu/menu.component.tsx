import React from 'react';
import { NavigationBar } from '@sk-web-gui/react';
import { shallow } from 'zustand/shallow';

import { UserMenu } from '@components/user-menu/user-menu.component';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';

import { HeadmasterNav } from './headmaster-nav-items.component';
import { MentorNavItems } from './mentor-nav-items.component';
import { TeacherNavItems } from './teacher-nav-items.component';

export const Menu = (): React.ReactElement => {
  const user = useUserStore((s) => s.user, shallow);
  const { headmaster, mentor, teacher } = hasRolePermission(user);

  let navItems = <></>;

  if (headmaster) navItems = <HeadmasterNav />;
  else {
    if (teacher) navItems = <TeacherNavItems />;
    if (mentor)
      navItems = (
        <>
          {navItems} <MentorNavItems />
        </>
      );
  }

  return (
    <NavigationBar className="flex-wrap justify-end" color="vattjom">
      {navItems}
      <NavigationBar.Item
        className="flex justify-end ml-32 max-phone-max:order-first max-phone-max:w-full"
        key={`menyitem-user-${user.name}`}
      >
        <UserMenu />
      </NavigationBar.Item>
    </NavigationBar>
  );
};

export default Menu;
