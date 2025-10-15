import { useUserStore } from '@services/user-service/user-service';
import { Icon, PopupMenu } from '@sk-web-gui/react';
import { UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { shallow } from 'zustand/shallow';

export const UserMenu: React.FC = () => {
  const user = useUserStore((state) => state.user, shallow);
  return (
    <PopupMenu>
      <PopupMenu.Button leftIcon={<Icon icon={<UserIcon />} />}>
        <span className="ml-4">{user.name}</span>
      </PopupMenu.Button>
      <PopupMenu.Panel className="w-full mt-xl">
        <PopupMenu.Item>
          <Link href="/logout">
            <Icon icon={<LogOut />} />
            Logga ut
          </Link>
        </PopupMenu.Item>
      </PopupMenu.Panel>
    </PopupMenu>
  );
};
