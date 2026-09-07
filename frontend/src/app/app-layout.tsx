'use client';

import LoginGuard from '@components/login-guard/login-guard';
import { AppWrapper } from '@contexts/app.context';
import { registerNavigator } from '@services/api-service';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { GuiProvider } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { GR, GY } = hasRolePermission(user);

  const getCurrentPeriod = usePupilForecastStore((s) => s.getCurrentPeriod);
  const getAllPeriods = usePupilForecastStore((s) => s.getAllPeriods);

  useEffect(() => {
    registerNavigator((href) => router.push(href));
  }, [router]);

  useEffect(() => {
    if (GR) {
      getCurrentPeriod(GR?.typeOfSchool);
    } else if (GY) {
      getCurrentPeriod(GY.typeOfSchool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GR?.typeOfSchool, GY?.typeOfSchool]);

  useEffect(() => {
    if (GR) {
      getAllPeriods(GR?.typeOfSchool);
    } else if (GY) {
      getAllPeriods(GY.typeOfSchool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GR, GY]);

  return (
    <GuiProvider>
      <AppWrapper>
        <LoginGuard>{children}</LoginGuard>
      </AppWrapper>
    </GuiProvider>
  );
}
