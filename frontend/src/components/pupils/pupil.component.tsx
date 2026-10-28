import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import { Skeleton } from '@components/skeleton/skeleton.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { hasRolePermission } from '@utils/has-role-permission';
import { FormProvider, useForm } from 'react-hook-form';
import { SinglePupilTable } from './components/single-pupil-table.component';
import { CornerLoader } from '@components/corner-loader/corner-loader.component';

export const Pupil: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const singlePupilIsLoading = usePupilForecastStore((s) => s.singlePupilIsLoading);
  const singlePupilIsLoaded = usePupilForecastStore((s) => s.singlePupilIsLoaded);
  const pupil = usePupilForecastStore((s) => s.pupil);
  const { headmaster } = hasRolePermission(user);

  const searchForm = useForm<SearchTableForm>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const { watch: watchSearch } = searchForm;
  const { searchQuery } = watchSearch();

  const pageTitle = pupil.length !== 0 ? `${pupil[0].givenname} ${pupil[0].lastname}` : 'Elev';

  const generalInformation = (
    <div className="flex gap-14">
      <span className="flex gap-4 items-center">
        {singlePupilIsLoaded ? (
          <>
            <strong>{pupil.length ?? 0}</strong> ämnen
          </>
        ) : (
          <Skeleton className="h-24 w-80">Laddar ämnen</Skeleton>
        )}
      </span>
    </div>
  );

  const imageWithText = {
    initials: `${pupil[0]?.className?.slice(0, 2)}`,
    imageText: `${pupil[0]?.className}`,
    textLink: headmaster ? `/klasser/klass/${pupil[0]?.classGroupId}` : `/min-mentorsklass/${pupil[0]?.classGroupId}`,
    color: 'vattjom' as 'vattjom' | 'juniskar' | 'bjornstigen' | 'gronsta',
  };

  return (
    <div>
      {singlePupilIsLoading && <CornerLoader />}
      <FormProvider {...searchForm}>
        <HeadingMenu
          loaded={singlePupilIsLoaded}
          pageTitle={pageTitle}
          imageWithTextProperties={imageWithText}
          GeneralInformation={generalInformation}
          callback="pupil"
          searchQuery={searchQuery}
          searchPlaceholder="Sök på ämne eller lärare..."
        />
      </FormProvider>

      <SinglePupilTable user={user} searchQuery={searchQuery} loaded={singlePupilIsLoaded} />
    </div>
  );
};
