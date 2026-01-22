import { PeriodPicker } from '@components/period-picker/period-picker.component';
import { ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { Avatar, cx, Divider, FormControl, Link, SearchField, Spinner } from '@sk-web-gui/react';
import { initialsFunction } from '@utils/initials';
import { callbackType } from '@utils/callback-type';
import { CopyPreviousForecast } from '@components/copy-previous-forecast/copy-previous-forecast.component';
import { hasRolePermission } from '@utils/has-role-permission';
import { useUserStore } from '@services/user-service/user-service';
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
  loaded: boolean;
}

export const HeadingMenu: React.FC<HeadingMenuProps> = ({
  pageTitle,
  GeneralInformation,
  imageWithTextProperties,
  teachers,
  callback,
  searchPlaceholder,
  syllabusId,
  loaded,
}) => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const { SUBJECT, PUPIL } = callbackType(callback);
  const { teacher, headmaster } = hasRolePermission(user);
  const singlePupilIsLoaded = usePupilForecastStore((s) => s.singlePupilIsLoaded);
  const placeHolder = searchPlaceholder ? searchPlaceholder : 'Sök i listan...';

  const { watch: watchSearch, setValue } = useFormContext<SearchTableForm>();

  const { searchQuery } = watchSearch();

  const onSearchHandler = () => ({});

  return (
    <div className="flex w-full flex-col mb-20">
      <div className="flex flex-wrap max-medium-device-max:gap-24 w-full justify-between items-center mb-20">
        <div className="large-device-min:w-[33%]">
          {headmaster && user.schools.length > 1 ? (
            <span className="text-h3-sm font-normal">{selectedSchool.schoolName}</span>
          ) : null}

          <h1
            className={cx(GeneralInformation ? 'mb-xs' : 'mb-0', {
              ['skeleton !block rounded-groups']: !loaded,
            })}
            data-cy="page-title"
            aria-busy={!loaded}
          >
            {pageTitle}
          </h1>
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
                  {imageWithTextProperties?.initials ? (
                    <Avatar
                      rounded
                      accent
                      color={imageWithTextProperties?.color ? imageWithTextProperties?.color : 'vattjom'}
                      initials={imageWithTextProperties?.initials}
                    />
                  ) : (
                    <Avatar rounded accent color="vattjom" initials={''} />
                  )}

                  {imageWithTextProperties?.imageText && singlePupilIsLoaded ? (
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
        <GeneralForecastInfo callback={callback} />
        {SUBJECT && teacher && <CopyPreviousForecast syllabusId={syllabusId || ''} />}
        <div className="flex gap-24 items-center">
          {SUBJECT && teacher && <ClearAllForecasts />}
          <FormControl className="max-medium-device:w-full">
            <SearchField
              value={searchQuery}
              onChange={(e) => setValue('searchQuery', e.target.value)}
              onSearch={onSearchHandler}
              placeholder={placeHolder}
              onReset={() => setValue('searchQuery', '')}
              data-cy="search-field"
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
};
