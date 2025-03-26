import LoginGuard from '@components/login-guard/login-guard';
import { GuiProvider } from '@sk-web-gui/react';
import '@styles/tailwind.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import type { AppProps /*, AppContext */ } from 'next/app';
import { AppWrapper } from '../contexts/app.context';
import { useEffect } from 'react';
import { hasRolePermission } from '@utils/has-role-permission';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';

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

function MyApp({ Component, pageProps }: AppProps) {
  const user = useUserStore((s) => s.user);
  const { GR, GY } = hasRolePermission(user);

  const getCurrentPeriod = usePupilForecastStore((s) => s.getCurrentPeriod);
  const getAllPeriods = usePupilForecastStore((s) => s.getAllPeriods);
  useEffect(() => {
    GR ? getCurrentPeriod(GR?.typeOfSchool) : GY && getCurrentPeriod(GY.typeOfSchool);
  }, [GR?.typeOfSchool, GY?.typeOfSchool]);

  useEffect(() => {
    GR ? getAllPeriods(GR?.typeOfSchool) : GY && getAllPeriods(GY.typeOfSchool);
  }, [GR, GY]);
  return (
    <GuiProvider /** colorScheme="light"**/>
      <AppWrapper>
        <LoginGuard>
          <Component {...pageProps} />
        </LoginGuard>
      </AppWrapper>
    </GuiProvider>
  );
}

export default MyApp;
