import { ForeacastQueriesDto } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { Icon, Link, NavigationBar, PopupMenu, useSnackbar } from '@sk-web-gui/react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

export const MentorNavItems = (): React.ReactElement => {
  const router = useRouter();
  const activeURL = router.pathname;

  const { getMyClasses, myClasses } = usePupilForecastStore();
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const toastMessage = useSnackbar();

  const classesQueries: ForeacastQueriesDto = useMemo(
    () => ({
      schoolId: selectedSchool?.schoolId,
      periodId: selectedPeriod?.periodId,
      OrderBy: 'GroupName',
      OrderDirection: 'ASC',
      PageSize: 10,
    }),
    [selectedSchool?.schoolId, selectedPeriod?.periodId]
  );

  useEffect(() => {
    getMyClasses(classesQueries).catch(() => {
      toastMessage({
        message: 'Något gick fel vid hämtning av alla klasser',
        status: 'error',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMyClasses, classesQueries, toastMessage]);

  const isCurrent = activeURL.includes('min-mentorsklass') || activeURL.includes('klasser');
  const classes = myClasses?.data ?? [];

  return (
    <NavigationBar.Item current={isCurrent}>
      <PopupMenu>
        <PopupMenu.Button rightIcon={<Icon icon={<ChevronDown />} />}>Klasser</PopupMenu.Button>
        <PopupMenu.Panel className="w-full">
          {classes.map((classlink) => {
            return (
              <PopupMenu.Item key={`popupmenyitem-${classlink.groupName}`}>
                <Link onClick={() => router.push(`/min-mentorsklass/${classlink.groupId}`)}>{classlink.groupName}</Link>
              </PopupMenu.Item>
            );
          })}
        </PopupMenu.Panel>
      </PopupMenu>
    </NavigationBar.Item>
  );
};
