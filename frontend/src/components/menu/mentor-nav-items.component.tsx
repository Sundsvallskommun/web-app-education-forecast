import { ForeacastQueriesDto, QuerySchoolsClasses } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { Icon, Link, NavigationBar, PopupMenu, useSnackbar } from '@sk-web-gui/react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

export const MentorNavItems = (): React.ReactElement => {
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

  return (
    <NavigationBar.Item current={isCurrent}>
      <PopupMenu>
        <PopupMenu.Button rightIcon={<Icon icon={<ChevronDown />} />}>Klasser</PopupMenu.Button>
        <PopupMenu.Panel>
          {schoolsClasses.map((schoolClasses) => {
            return (
              <PopupMenu.Item key={`popupmenyitem-${schoolClasses.schoolId}`}>
                <PopupMenu>
                  <PopupMenu.Button rightIcon={<Icon icon={<ChevronDown />} />}>
                    {schoolClasses.schoolName}
                  </PopupMenu.Button>
                  <PopupMenu.Panel>
                    {schoolClasses.classes.data.map((classLink) => {
                      return (
                        <PopupMenu.Item>
                          <Link onClick={() => router.push(`/min-mentorsklass/${classLink.groupId}`)}>
                            {classLink.groupName}
                          </Link>
                        </PopupMenu.Item>
                      );
                    })}
                  </PopupMenu.Panel>
                </PopupMenu>
              </PopupMenu.Item>
            );
          })}
        </PopupMenu.Panel>
      </PopupMenu>
    </NavigationBar.Item>
  );
};
