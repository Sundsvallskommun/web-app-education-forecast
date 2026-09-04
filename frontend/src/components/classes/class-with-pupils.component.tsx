import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import { Skeleton } from '@components/skeleton/skeleton.component';
import Main from '@layouts/main/main.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { FormProvider, useForm } from 'react-hook-form';
import { MentorClassTable } from './components/class-with-pupils-table.component';
import { CornerLoader } from '@components/corner-loader/corner-loader.component';

export const ClassWithPupils: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const mentorClassIsLoaded = usePupilForecastStore((s) => s.mentorClassIsLoaded);
  const mentorClassIsLoading = usePupilForecastStore((s) => s.mentorClassIsLoading);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);

  const fullTitle = mentorClassIsLoaded ? `Klass ${mentorClass[0]?.className}` : 'Klass';

  const searchForm = useForm<SearchTableForm>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const { watch: watchSearch } = searchForm;
  const { searchQuery } = watchSearch();

  const generalInformation =
    mentorClass.length !== 0 ? (
      <span>
        <strong>{mentorClass.length}</strong> elever
      </span>
    ) : (
      <Skeleton className="w-64 h-24">Laddar klass</Skeleton>
    );
  return (
    <div>
      {mentorClassIsLoading && <CornerLoader />}
      <Main>
        <FormProvider {...searchForm}>
          <HeadingMenu
            loaded={mentorClassIsLoaded}
            pageTitle={fullTitle}
            GeneralInformation={generalInformation}
            teachers={[
              {
                givenname: user.name.split(' ')[0],
                lastname: user.name.split(' ')[1],
                personId: user.personId,
                email: user.username,
              },
            ]}
            callback="mentorclass"
            searchQuery={searchQuery}
            searchPlaceholder="Sök på elev..."
          />
        </FormProvider>
      </Main>

      <div className="max-w-[4000px] w-full">
        <MentorClassTable
          loaded={mentorClassIsLoaded && !mentorClassIsLoading && mentorClass?.length !== 0}
          user={user}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};
