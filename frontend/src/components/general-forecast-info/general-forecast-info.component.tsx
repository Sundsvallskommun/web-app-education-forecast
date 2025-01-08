import { GroupTables } from '@components/tables/group-tables.component';
import { PupilTables } from '@components/tables/all-pupils-table.component';
import { CustomPupilTable } from '@components/tables/forecast-pupil-tables.component';
import { MentorClassTable } from '@components/tables/mentor-class-table.component';
import { callbackType } from '@utils/callback-type';
import { useUserStore } from '@services/user-service/user-service';
import { Label, Spinner } from '@sk-web-gui/react';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { hasRolePermission } from '@utils/has-role-permission';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { thisSchoolYearPeriod } from '@utils/school-year-period';
interface GeneralForecastInfoProps {
  callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil';
}

export const GeneralForecastInfo: React.FC<GeneralForecastInfoProps> = ({ callback }) => {
  const user = useUserStore((s) => s.user);
  const { GY, GR } = hasRolePermission(user);
  const { CLASSES, MENTORCLASS, PUPIL, PUPILS, SUBJECTS, SUBJECT } = callbackType(callback);
  let grouptype;
  if (SUBJECTS) {
    grouptype = 'G';
  } else if (CLASSES) {
    grouptype = 'K';
  }
  const { grouptable } = GroupTables(grouptype, user);
  const { pupilsInGroupData } = CustomPupilTable(user, PUPIL && true);
  const { mentorClassData } = MentorClassTable(user);
  const { allPupilsTable } = PupilTables();
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const [summerPeriod, setSummerPeriod] = useState<boolean>(false);
  const { currentMonthPeriod } = thisSchoolYearPeriod();

  const months = [
    'januari',
    'februari',
    'mars',
    'april',
    'maj',
    'juni',
    'juli',
    'augusti',
    'september',
    'oktober',
    'november',
    'december',
  ];

  const selectedMonth = selectedPeriod?.toLowerCase().split(' ').slice(1)[0];

  const date = new Date(
    new Date().getFullYear(),
    months.findIndex((x) => x === selectedMonth)
  );

  const year = date.getFullYear();
  const month = date.getMonth();

  const lastDay = new Date(year, month + 1, 0);
  const currentDate = new Date();

  let forecastStatus;

  const daysLeft = (dat1, date2) => {
    return Math.round((dat1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
  };

  if (GY) {
    if (currentDate.toLocaleString() <= lastDay.toLocaleString()) {
      forecastStatus = (
        <span className="ml-6">
          <strong>
            Prognoser att fylla i senast {lastDay.getDate()}/{lastDay.getMonth() + 1} (
            {currentDate === lastDay ? 'idag' : `om ${daysLeft(lastDay, currentDate)} dagar`}){' '}
          </strong>
        </span>
      );
    } else if (currentDate.toLocaleString() > lastDay.toLocaleString()) {
      forecastStatus = (
        <span className="text-error ml-6">
          <strong>
            Prognoser skulle ha fyllts i {lastDay.getDate()}/{lastDay.getMonth() + 1}
          </strong>{' '}
        </span>
      );
    }
  } else if (GR) {
    const april = dayjs(new Date(new Date().getFullYear(), 3, 12)).toDate();
    const december = dayjs(
      new Date(currentMonthPeriod === 'HT September' ? new Date().getFullYear() : selectedSchoolYear, 11, 31)
    ).toDate();
    if (selectedPeriod === 'VT') {
      if (currentDate <= april) {
        forecastStatus = (
          <span className="ml-6">
            <strong>
              Prognoser att fylla i senast {dayjs(april).format('DD/M')} (
              {currentDate === april ? 'idag' : `om ${daysLeft(april, currentDate)} dagar`}){' '}
            </strong>
          </span>
        );
      } else if (currentDate > april) {
        forecastStatus = (
          <span className="text-error ml-6">
            <strong>Prognoser skulle ha fyllts i {dayjs(april).format('DD/M')}</strong>{' '}
          </span>
        );
      }
    } else if (selectedPeriod === 'HT') {
      if (currentDate <= december) {
        forecastStatus = (
          <span className="ml-6">
            <strong>
              Prognoser att fylla i senast {dayjs(december).format('DD/M')} (
              {currentDate === december ? 'idag' : `om ${daysLeft(december, currentDate)} dagar`}){' '}
            </strong>
          </span>
        );
      } else if (currentDate > december) {
        forecastStatus = (
          <span className="text-error ml-6">
            <strong>Prognoser skulle ha fyllts i {dayjs(december).format('DD/M')}</strong>{' '}
          </span>
        );
      }
    }
  }

  let isLoading;
  let numberOfNotFilledIn = 0;
  if (SUBJECTS || CLASSES) {
    grouptable.forEach((g) => {
      numberOfNotFilledIn += g.notFilledIn;
    });

    isLoading = grouptable.length === 0;
  }

  if (PUPILS) {
    allPupilsTable.forEach((g) => {
      numberOfNotFilledIn += g.notFilledIn;
    });

    isLoading = allPupilsTable.length === 0;
  }

  if (SUBJECT) {
    pupilsInGroupData.forEach((g) => {
      numberOfNotFilledIn += g.hasNotFilledIn;
    });
    isLoading = pupilsInGroupData.length === 0;
  }

  if (MENTORCLASS) {
    mentorClassData.forEach((g) => {
      numberOfNotFilledIn += g.notFilledIn;
    });
    isLoading = mentorClassData.length === 0;
  }

  if (PUPIL) {
    pupilsInGroupData.forEach((g) => {
      numberOfNotFilledIn += g.hasNotFilledIn;
    });
    isLoading = pupilsInGroupData.length === 0;
  }

  useEffect(() => {
    if (GR) {
      if (
        selectedPeriod === 'HT' &&
        dayjs(new Date()).month() >= dayjs(new Date(year, 5, 1)).month() &&
        dayjs(new Date()).month() < dayjs(new Date(year, 7, 1)).month()
      ) {
        setSummerPeriod(true);
      } else {
        setSummerPeriod(false);
      }
    }

    if (GY) {
      if (
        selectedPeriod === 'HT September' &&
        dayjs(date).month() >= dayjs(new Date(year, 5, 1)).month() &&
        dayjs(date).month() < dayjs(new Date(year, 7, 1)).month()
      ) {
        setSummerPeriod(true);
      } else {
        setSummerPeriod(false);
      }
    }
  }, []);

  return numberOfNotFilledIn !== 0 ? (
    <div className="flex gap-10">
      {!isLoading ? (
        <span>
          <Label rounded inverted={summerPeriod} color={summerPeriod ? 'juniskar' : 'tertiary'}>
            {summerPeriod
              ? 'Prognoser till hösten är låsta under sommarperioden'
              : numberOfNotFilledIn
                ? numberOfNotFilledIn
                : 'Saknar'}
          </Label>
          {!summerPeriod && forecastStatus}
        </span>
      ) : (
        <Spinner size={3} />
      )}
    </div>
  ) : (
    <></>
  );
};
