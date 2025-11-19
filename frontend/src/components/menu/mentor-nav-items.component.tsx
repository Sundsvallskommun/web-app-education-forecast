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
          {schoolsClasses.map((schoolClasses, index) => {
            const headingId = `${schoolClasses.schoolId}-label`;
            return (
              <PopupMenu.Group
                title={`${schoolClasses.schoolName}-classes`}
                aria-labelledby={headingId}
                key={`popupmenyitem-${schoolClasses.schoolId}`}
              >
                <label className="text-label-medium px-8 pt-8" id={headingId} data-cy="school-name">
                  {schoolClasses.schoolName}
                </label>
                <PopupMenu.Items autoFocus={index === 0}>
                  {schoolClasses.classes.data.map((classLink, idx) => {
                    return (
                      <PopupMenu.Item key={classLink.groupId}>
                        <Link
                          onClick={() => router.push(`/min-mentorsklass/${classLink.groupId}`)}
                          data-cy={`popup-menu-class-item-${idx}-link`}
                        >
                          {classLink.groupName}
                        </Link>
                      </PopupMenu.Item>
                    );
                  })}
                </PopupMenu.Items>
              </PopupMenu.Group>
            );
          })}
        </PopupMenu.Panel>
      </PopupMenu>
    </NavigationBar.Item>,
  ];
};
