import React from 'react';
import { NavigationBar } from '@sk-web-gui/react';
import { shallow } from 'zustand/shallow';

import { UserMenu } from '@components/user-menu/user-menu.component';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';

import { useHeadmasterNav } from './headmaster-nav-items.component';
import { useMentorNavItems } from './mentor-nav-items.component';
import { useTeacherNavItems } from './teacher-nav-items.component';

export const Menu = (): React.ReactElement => {
  const user = useUserStore((s) => s.user, shallow);
  const { headmaster, mentor, teacher } = hasRolePermission(user);
  const headmasterNavItems = useHeadmasterNav();
  const teacherNavItems = useTeacherNavItems();
  const mentorNavItems = useMentorNavItems();

  const navItems: React.ReactNode[] = [];

  if (headmaster) navItems.push(...headmasterNavItems);
  else {
    if (teacher) navItems.push(...teacherNavItems);
    if (mentor) navItems.push(...mentorNavItems);
  }

  return (
    <NavigationBar className="flex-wrap justify-end" color="vattjom" data-cy="navigation-bar">
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
