import { PeriodPicker } from '@components/period-picker/period-picker.component';
import { ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { Avatar, Divider, FormControl, Link, SearchField, Spinner } from '@sk-web-gui/react';
import { initialsFunction } from '@utils/initials';
import { callbackType } from '@utils/callback-type';
import { CopyPreviousForecast } from '@components/copy-previous-forecast/copy-previous-forecast.component';
import { hasRolePermission } from '@utils/has-role-permission';
import { useUserStore } from '@services/user-service/user-service';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { ClearAllForecasts } from '@components/clear-all-forecasts/clear-all-forecasts.component';
import { GeneralForecastInfo } from '@components/general-forecast-info/general-forecast-info.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import { ReactNode } from 'react';

export interface SearchTableForm {
  searchQuery: string;
}

interface HeadingMenuProps {
  pageTitle: string;
  GeneralInformation?: ReactNode;
  imageWithTextProperties?: {
    initials?: string;
    imageText?: string;
    textLink?: string;
    color?: 'vattjom' | 'juniskar' | 'bjornstigen' | 'gronsta';
  };
  teachers?: ForecastMyGroupTeacher[] | null | undefined;
  objectId?: string;
  callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil';
  searchQuery?: string;
  searchPlaceholder?: string;
  syllabusId?: string;
}

export const HeadingMenu: React.FC<HeadingMenuProps> = ({
  pageTitle,
  GeneralInformation,
  imageWithTextProperties,
  teachers,
  callback,
  searchPlaceholder,
  syllabusId,
}) => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const { SUBJECT, PUPIL } = callbackType(callback);
  const { teacher, headmaster } = hasRolePermission(user);
  const subject = usePupilForecastStore((s) => s.subject);
  const subjectIsLoading = usePupilForecastStore((s) => s.singleSubjectIsLoading);
  const singlePupilIsLoading = usePupilForecastStore((s) => s.singlePupilIsLoading);
  const previousGroup = useForecastStore((s) => s.previousPeriodGroup);
  const placeHolder = searchPlaceholder ? searchPlaceholder : 'Sök i listan...';

  const { watch: watchSearch, setValue } = useFormContext<SearchTableForm>();

  const { searchQuery } = watchSearch();

  const onSearchHandler = () => ({});
  const searchForm = (
    <FormControl className="max-medium-device:w-full">
      <SearchField
        value={searchQuery}
        onChange={(e) => setValue('searchQuery', e.target.value)}
        onSearch={onSearchHandler}
        placeholder={placeHolder}
        onReset={() => setValue('searchQuery', '')}
      />
    </FormControl>
  );
  return (
    <div className="flex w-full flex-col mb-20">
      <div className="flex flex-wrap max-medium-device-max:gap-24 w-full justify-between items-center mb-20">
        <div className="large-device-min:w-[33%]">
          {headmaster && user.schools.length > 1 ? (
            <span className="text-h3-sm font-normal">{selectedSchool.schoolName}</span>
          ) : null}

          <h1 className={GeneralInformation ? 'mb-xs' : 'mb-0'}>{pageTitle}</h1>
          <>{GeneralInformation}</>
        </div>
        <div className="large-device-min:w-[33%]">
          <PeriodPicker callback={callback} />
        </div>
        <div
          className={`large-device-min:w-[33%] max-medium-device-max:w-full flex ${
            teachers?.length !== 0 ? 'gap-10' : 'gap-24'
          }  justify-end items-center`}
        >
          <>
            {callback === 'pupil' && (
              <>
                <div className="flex gap-10 items-center">
                  {!singlePupilIsLoading && imageWithTextProperties?.initials ? (
                    <Avatar
                      rounded
                      accent
                      color={imageWithTextProperties?.color ? imageWithTextProperties?.color : 'vattjom'}
                      initials={imageWithTextProperties?.initials}
                    />
                  ) : (
                    <Avatar rounded accent color="vattjom" initials={''} />
                  )}

                  {imageWithTextProperties?.imageText && !singlePupilIsLoading ? (
                    <span className={imageWithTextProperties?.textLink ? 'font-bold' : ''}>
                      {imageWithTextProperties?.textLink ? (
                        <Link
                          className="cursor-pointer"
                          onClick={() => router.push(imageWithTextProperties?.textLink || '')}
                        >
                          {PUPIL ? `Klass ${imageWithTextProperties?.imageText}` : imageWithTextProperties?.imageText}
                        </Link>
                      ) : (
                        `${imageWithTextProperties?.imageText}`
                      )}
                    </span>
                  ) : (
                    <Spinner size={2} />
                  )}
                </div>
              </>
            )}
          </>

          {teachers?.length !== 0 ? (
            <div className="max-w-[360px] flex justify-end">
              <div className="w-fit float-right">
                {teachers?.map((t) => {
                  const secondletterInLastName = t.lastname && t?.lastname.split('').slice(1, 2);
                  const abbreviation = `${initialsFunction(`${t?.givenname} ${t?.lastname}`)}${secondletterInLastName}`;
                  const lastObject = teachers[teachers.length - 1];
                  return (
                    <span key={`ansvarig-${t?.personId}`} className="mr-4">
                      {t?.givenname} {t?.lastname} ({abbreviation})
                      {teachers.length > 1 && t?.personId !== lastObject.personId && ','}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <Spinner size={2} />
          )}
        </div>
      </div>
      <Divider />

      <div className="flex flex-wrap justify-between items-center mt-20 gap-24">
        {/* {selectedPeriod?.includes('Juni') || selectedPeriod?.includes('Juli') || selectedPeriod?.includes('Augusti') ? (
          <span className="bold text-error"> Inga prognoser att fylla i under sommaren</span>
        ) : ( */}
        <GeneralForecastInfo callback={callback} />
        {/* )} */}
        {SUBJECT && teacher ? (
          <>
            {subject.find((x) => x.forecast !== null) ? (
              <>
                {!subjectIsLoading ? (
                  <div className="flex justify-center items-center">
                    {(subject.find((x) => x.forecast === null) && subject.find((x) => x.previousForecast !== null)) ||
                    (subject.find((x) => x.forecast === null) && previousGroup.find((x) => x.forecast !== null)) ? (
                      <CopyPreviousForecast syllabusId={syllabusId || ''} />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <Spinner size={3} />
                )}
                <div className="flex flex-wrap justify-end items-center gap-24">
                  <ClearAllForecasts />
                  <FormControl className="max-medium-device:w-full">{searchForm}</FormControl>
                </div>
              </>
            ) : (
              <>
                {!subjectIsLoading ? (
                  <div className="flex justify-center items-center">
                    {((subject.find((x) => x.forecast === null) && subject.find((x) => x.previousForecast !== null)) ||
                      (subject.find((x) => x.forecast === null) && previousGroup.find((x) => x.forecast !== null))) && (
                      <CopyPreviousForecast syllabusId={syllabusId || ''} />
                    )}
                  </div>
                ) : (
                  <Spinner size={3} />
                )}

                <div>
                  <FormControl className="max-medium-device:w-full">{searchForm}</FormControl>
                </div>
              </>
            )}
          </>
        ) : (
          <FormControl className="max-medium-device:w-full">{searchForm}</FormControl>
        )}
      </div>
    </div>
  );
};
