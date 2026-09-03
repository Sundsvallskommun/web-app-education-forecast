import { callbackType } from '@utils/callback-type';
import { cx, Label } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { Skeleton } from '@components/skeleton/skeleton.component';
import { useShallow } from 'zustand/react/shallow';
interface GeneralForecastInfoProps {
  callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil';
}

export const GeneralForecastInfo: React.FC<GeneralForecastInfoProps> = ({ callback }) => {
  const { CLASSES, MENTORCLASS, PUPIL, PUPILS, SUBJECTS, SUBJECT } = callbackType(callback);

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
  } = usePupilForecastStore(
    useShallow((s) => ({
      mySubjects: s.mySubjects,
      myClasses: s.myClasses,
      subject: s.subject,
      pupil: s.pupil,
      allPupils: s.allPupils,
      mentorClass: s.mentorClass,
      subjectsIsLoading: s.subjectsIsLoading,
      classesIsLoading: s.classesIsLoading,
      mentorClassIsLoading: s.mentorClassIsLoading,
      pupilsIsLoading: s.pupilsIsLoading,
      singleSubjectIsLoading: s.singleSubjectIsLoading,
      singlePupilIsLoading: s.singlePupilIsLoading,
    }))
  );
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const allPeriods = usePupilForecastStore((s) => s.allPeriods);
  const [summerPeriod, setSummerPeriod] = useState<boolean>(false);

  const endDate = new Date(selectedPeriod?.endDate);
  const currentDate = new Date();

  let forecastStatus;

  const daysLeft = (dat1: Date, date2: Date) => {
    return Math.round((dat1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
  };

  if (currentDate.toLocaleString() <= endDate.toLocaleString()) {
    forecastStatus = (
      <span>
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

  let numberOfNotFilledIn = 0;
  if (SUBJECTS) {
    mySubjects.data.forEach((g) => {
      const notFilledIn =
        (g?.totalPupils || 0) - (g?.approvedPupils || 0) - (g?.warningPupils || 0) - (g?.unapprovedPupils || 0);
      numberOfNotFilledIn += notFilledIn;
    });
  }

  if (CLASSES) {
    myClasses.data.forEach((g) => {
      const notFilledIn =
        (g?.totalPupils || 0) - (g?.approvedPupils || 0) - (g?.warningPupils || 0) - (g?.unapprovedPupils || 0);
      numberOfNotFilledIn += notFilledIn;
    });
  }

  if (PUPILS) {
    allPupils.data.forEach((p) => {
      const notFilledIn =
        p.totalSubjects !== 0 && p.totalSubjects !== null
          ? p.totalSubjects - (p?.approved || 0) - (p?.warnings || 0) - (p?.unapproved || 0)
          : 0;
      numberOfNotFilledIn += notFilledIn;
    });
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
  }

  if (MENTORCLASS) {
    mentorClass.forEach((p) => {
      const notFilledIn = p.forecasts?.filter((x) => x.forecast === null).length;
      numberOfNotFilledIn += notFilledIn;
    });
  }

  if (PUPIL) {
    pupil.forEach((p) => {
      const notFilledIn = pupil.length - (p.forecast !== null ? 1 : 0);
      numberOfNotFilledIn = notFilledIn;
    });
  }

  const isLoading = () => {
    if (SUBJECTS) {
      return subjectsIsLoading;
    }

    if (CLASSES) {
      return classesIsLoading;
    }

    if (PUPILS) {
      return pupilsIsLoading;
    }

    if (SUBJECT) {
      return singleSubjectIsLoading && subjectsIsLoading;
    }

    if (MENTORCLASS) {
      return mentorClassIsLoading;
    }

    if (PUPIL) {
      return singlePupilIsLoading;
    }
  };
  useEffect(() => {
    if (allPeriods) {
      if (
        currentDate >= new Date(`${new Date().getFullYear()}-07-01`) &&
        currentDate < new Date(allPeriods[allPeriods.length - 1]?.startDate) &&
        currentDate < new Date(selectedPeriod.startDate)
      ) {
        setSummerPeriod(true);
      } else {
        setSummerPeriod(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const getLabelText = () => {
    if (isLoading()) {
      return 'Laddar period';
    }
    if (summerPeriod) {
      return 'Prognoser till hösten är låsta under sommarperioden';
    }
    return numberOfNotFilledIn ?? 'Saknar';
  };

  return !isLoading() && numberOfNotFilledIn < 1 ? (
    <> Inga prognoser att fylla i den här perioden</>
  ) : (
    <div className="flex gap-10">
      <span className="inline-flex gap-6">
        <Label
          rounded
          className={cx({ ['skeleton w-24']: isLoading() })}
          inverted={summerPeriod}
          aria-busy={isLoading()}
          color={summerPeriod ? 'juniskar' : 'tertiary'}
        >
          {getLabelText()}
        </Label>

        {isLoading() ? <Skeleton className="h-24 w-[20rem]" /> : !summerPeriod && forecastStatus}
      </span>
    </div>
  );
};
