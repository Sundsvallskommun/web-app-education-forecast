import { QuerySchoolsClasses } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { Icon, Link, NavigationBar, PopupMenu, useSnackbar } from '@sk-web-gui/react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

export const useMentorNavItems = (): React.ReactNode[] => {
  const router = useRouter();
  const activeURL = router.pathname;

  const { getMySchoolsClasses, mySchoolsClasses } = usePupilForecastStore();
  const schools = useUserStore((s) => s.user.schools, shallow);

  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const toastMessage = useSnackbar();

  const schoolsClassesQuery: QuerySchoolsClasses = useMemo(
    () => ({
      schools,
      periodId: selectedPeriod?.periodId,
      OrderBy: 'GroupName',
      OrderDirection: 'ASC',
      PageSize: 10,
    }),
    [schools, selectedPeriod]
  );

  useEffect(() => {
    getMySchoolsClasses(schoolsClassesQuery).catch(() => {
      toastMessage({
        message: 'Något gick fel vid hämtning av alla klasser',
        status: 'error',
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolsClassesQuery, toastMessage]);

  const isCurrent = activeURL.includes('min-mentorsklass') || activeURL.includes('klasser');
  const schoolsClasses = mySchoolsClasses ?? [];

  return [
    <NavigationBar.Item current={isCurrent} key={'mentor-nav-item'}>
      <PopupMenu>
        <PopupMenu.Button rightIcon={<Icon icon={<ChevronDown />} />}>Klasser</PopupMenu.Button>
        <PopupMenu.Panel>
          {schoolsClasses.map((schoolClasses) => {
            return (
              <div className="px-15" key={`popupmenyitem-${schoolClasses.schoolId}`}>
                <div className="mt-15">{schoolClasses.schoolName}</div>
                {schoolClasses.classes.data.map((classLink) => {
                  return (
                    <PopupMenu.Item key={classLink.groupId}>
                      <Link onClick={() => router.push(`/min-mentorsklass/${classLink.groupId}`)}>
                        {classLink.groupName}
                      </Link>
                    </PopupMenu.Item>
                  );
                })}
              </div>
            );
          })}
        </PopupMenu.Panel>
      </PopupMenu>
    </NavigationBar.Item>,
  ];
};
