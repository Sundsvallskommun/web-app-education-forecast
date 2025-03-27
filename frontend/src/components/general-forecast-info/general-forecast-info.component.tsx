import { callbackType } from '@utils/callback-type';
import { useUserStore } from '@services/user-service/user-service';
import { Label, Spinner } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
interface GeneralForecastInfoProps {
  callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil';
}

export const GeneralForecastInfo: React.FC<GeneralForecastInfoProps> = ({ callback }) => {
  const user = useUserStore((s) => s.user);
  const { CLASSES, MENTORCLASS, PUPIL, PUPILS, SUBJECTS, SUBJECT } = callbackType(callback);
  let grouptype = 'G';
  if (SUBJECTS) {
    grouptype = 'G';
  } else if (CLASSES) {
    grouptype = 'K';
  }
  const {
    mySubjects,
    myClasses,
    subject,
    pupil,
    allPupils,
    mentorClass,
    subjectsIsLoading,
    classesIsLoading,
    mentorClassIsLoading,
    pupilsIsLoading,
    singleSubjectIsLoading,
    singlePupilIsLoading,
  } = usePupilForecastStore();
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const allPeriods = usePupilForecastStore((s) => s.allPeriods);
  const [summerPeriod, setSummerPeriod] = useState<boolean>(false);

  const endDate = new Date(selectedPeriod?.endDate);
  const currentDate = new Date();

  //const year = endDate === 'december' ? selectedSchoolYear : date.getFullYear();

  let forecastStatus;

  const daysLeft = (dat1: Date, date2: Date) => {
    return Math.round((dat1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
  };

  if (currentDate.toLocaleString() <= endDate.toLocaleString()) {
    forecastStatus = (
      <span className="ml-6">
        <strong>
          Prognoser att fylla i senast {dayjs(endDate).format('DD/MM')} (
          {currentDate === endDate ? 'idag' : `om ${daysLeft(endDate, currentDate)} dagar`}){' '}
        </strong>
      </span>
    );
  } else if (currentDate.toLocaleString() > endDate.toLocaleString()) {
    forecastStatus = (
      <span className="text-error ml-6">
        <strong>Prognoser skulle ha fyllts i {dayjs(endDate).format('DD/MM')}</strong>{' '}
      </span>
    );
  }

  let isLoading;
  let numberOfNotFilledIn = 0;
  if (SUBJECTS) {
    mySubjects.data.forEach((g) => {
      const notFilledIn =
        (g?.totalPupils || 0) - (g?.approvedPupils || 0) - (g?.warningPupils || 0) - (g?.unapprovedPupils || 0);
      numberOfNotFilledIn += notFilledIn;
    });

    isLoading = subjectsIsLoading;
  }

  if (CLASSES) {
    myClasses.data.forEach((g) => {
      const notFilledIn =
        (g?.totalPupils || 0) - (g?.approvedPupils || 0) - (g?.warningPupils || 0) - (g?.unapprovedPupils || 0);
      numberOfNotFilledIn += notFilledIn;
    });

    isLoading = classesIsLoading;
  }

  if (PUPILS) {
    allPupils.data.forEach((p) => {
      const notFilledIn =
        p.totalSubjects !== 0 && p.totalSubjects !== null
          ? p.totalSubjects - (p?.approved || 0) - (p?.warnings || 0) - (p?.unapproved || 0)
          : 0;
      numberOfNotFilledIn += notFilledIn;
    });

    isLoading = pupilsIsLoading;
  }

  if (SUBJECT) {
    subject.forEach((p) => {
      const totalPupils = mySubjects.data.find((s) => s.groupId === p.groupId)?.totalPupils;
      const approved = mySubjects.data.find((s) => s.groupId === p.groupId)?.approvedPupils;
      const warnings = mySubjects.data.find((s) => s.groupId === p.groupId)?.warningPupils;
      const unapproved = mySubjects.data.find((s) => s.groupId === p.groupId)?.unapprovedPupils;
      const notFilledIn = totalPupils ? totalPupils - (approved || 0) - (warnings || 0) - (unapproved || 0) : 0;
      numberOfNotFilledIn = notFilledIn;
    });
    isLoading = singleSubjectIsLoading && subjectsIsLoading;
  }

  console.log(numberOfNotFilledIn);

  if (MENTORCLASS) {
    mentorClass.forEach((p) => {
      const notFilledIn = p.forecasts?.filter((x) => x.forecast === null).length;
      numberOfNotFilledIn += notFilledIn;
    });
    isLoading = mentorClassIsLoading;
  }

  if (PUPIL) {
    pupil.forEach((p) => {
      const notFilledIn = pupil.length - (p.forecast !== null ? 1 : 0);
      numberOfNotFilledIn = notFilledIn;
    });
    isLoading = singlePupilIsLoading;
  }

  useEffect(() => {
    if (
      currentDate >= new Date(`${new Date().getFullYear()}-07-01`) &&
      currentDate < new Date(allPeriods[allPeriods.length - 1].startDate) &&
      currentDate < new Date(selectedPeriod.startDate)
    ) {
      setSummerPeriod(true);
    } else {
      setSummerPeriod(false);
    }
  }, [selectedPeriod]);

  return (
    <div className="flex gap-10">
      {!isLoading ? (
        <span>
          {numberOfNotFilledIn !== 0 ? (
            <>
              <Label rounded inverted={summerPeriod} color={summerPeriod ? 'juniskar' : 'tertiary'}>
                {summerPeriod
                  ? 'Prognoser till hösten är låsta under sommarperioden'
                  : numberOfNotFilledIn
                    ? numberOfNotFilledIn
                    : 'Saknar'}
              </Label>
              {!summerPeriod && forecastStatus}
            </>
          ) : (
            <> Inga prognoser att fylla i den här perioden</>
          )}
        </span>
      ) : (
        <Spinner size={3} />
      )}
    </div>
  );
};
