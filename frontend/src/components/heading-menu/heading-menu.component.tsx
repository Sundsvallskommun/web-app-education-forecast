import { PeriodPicker } from '@components/period-picker/period-picker.component';
import { ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { Avatar, Divider, FormControl, Link, SearchField, Spinner } from '@sk-web-gui/react';
import { initialsFunction } from '@utils/initials';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { callbackType } from '@utils/callback-type';
import { CopyPreviousForecast } from '@components/copy-previous-forecast/copy-previous-forecast.component';
import { hasRolePermission } from '@utils/has-role-permission';
import { useUserStore } from '@services/user-service/user-service';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { ClearAllForecasts } from '@components/clear-all-forecasts/clear-all-forecasts.component';
import { GeneralForecastInfo } from '@components/general-forecast-info/general-forecast-info.component';
import { useDebouncedCallback } from '@react-hookz/web';

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
  setSearchQuery?: Dispatch<SetStateAction<string>> | null | undefined;
  searchPlaceholder?: string;
}

export const HeadingMenu: React.FC<HeadingMenuProps> = ({
  pageTitle,
  GeneralInformation,
  imageWithTextProperties,
  teachers,
  callback,
  searchQuery,
  setSearchQuery,
  searchPlaceholder,
}) => {
  const user = useUserStore((s) => s.user);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const { SUBJECT, PUPIL } = callbackType(callback);
  const { teacher } = hasRolePermission(user);
  const subject = useForecastStore((s) => s.groupWithPupils);
  const subjectIsLoading = useForecastStore((s) => s.groupWithPupilsIsLoading);
  const singlePupilIsLoading = useForecastStore((s) => s.singlePupilIsLoading);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const previousGroup = useForecastStore((s) => s.previousPeriodGroup);
  const placeHolder = searchPlaceholder ? searchPlaceholder : 'Sök i listan...';

  const setDelayQuery = useDebouncedCallback(
    (query: string) => {
      setSearchQuery && setSearchQuery(query);
    },
    [],
    150,
    500
  );

  const onSearchChangeHandler = (e: React.BaseSyntheticEvent) => {
    setSearchTerm(e.target.value);
    setDelayQuery(e.target.value);
  };

  const onSearchHandler = () => ({});
  return (
    <div className="flex w-full flex-col mb-20">
      <div className="flex flex-wrap max-medium-device-max:gap-24 w-full justify-between items-center mb-20">
        <div className="large-device-min:w-[33%]">
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
                        <Link href={imageWithTextProperties?.textLink}>
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
        {selectedPeriod?.includes('Juni') || selectedPeriod?.includes('Juli') || selectedPeriod?.includes('Augusti') ? (
          <span className="bold text-error"> Inga prognoser att fylla i under sommaren</span>
        ) : (
          <GeneralForecastInfo callback={callback} />
        )}
        {SUBJECT && teacher ? (
          <>
            {subject.find((x) => x.forecast !== null) ? (
              <>
                {!subjectIsLoading ? (
                  <div className="flex justify-center items-center">
                    {(subject.find((x) => x.forecast === null) && subject.find((x) => x.previousForecast !== null)) ||
                    (subject.find((x) => x.forecast === null) && previousGroup.find((x) => x.forecast !== null)) ? (
                      <CopyPreviousForecast />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <Spinner size={3} />
                )}
                <div className="flex flex-wrap justify-end items-center gap-24">
                  <ClearAllForecasts />
                  <FormControl className="max-medium-device:w-full">
                    <SearchField
                      value={searchTerm as string}
                      onChange={onSearchChangeHandler}
                      onSearch={onSearchHandler}
                      placeholder={placeHolder}
                    />
                  </FormControl>
                </div>
              </>
            ) : (
              <>
                {!subjectIsLoading ? (
                  <div className="flex justify-center items-center">
                    {((subject.find((x) => x.forecast === null) && subject.find((x) => x.previousForecast !== null)) ||
                      (subject.find((x) => x.forecast === null) && previousGroup.find((x) => x.forecast !== null))) && (
                      <CopyPreviousForecast />
                    )}
                  </div>
                ) : (
                  <Spinner size={3} />
                )}
                <div>
                  <FormControl className="max-medium-device:w-full">
                    <SearchField
                      value={searchTerm as string}
                      onChange={onSearchChangeHandler}
                      onSearch={onSearchHandler}
                      placeholder={placeHolder}
                    />
                  </FormControl>
                </div>
              </>
            )}
          </>
        ) : (
          <FormControl className="max-medium-device:w-full">
            <SearchField
              value={searchTerm as string}
              onChange={onSearchChangeHandler}
              onSearch={onSearchHandler}
              placeholder={placeHolder}
            />
          </FormControl>
        )}
      </div>
    </div>
  );
};
