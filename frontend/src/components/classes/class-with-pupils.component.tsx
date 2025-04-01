import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import Loader from '@components/loader/loader';
import { Spinner } from '@sk-web-gui/react';
import Main from '@layouts/main/main.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { MentorClassTable } from './components/class-with-pupils-table.component';
import { FormProvider, useForm } from 'react-hook-form';

export const ClassWithPupils: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const mentorClassIsLoading = usePupilForecastStore((s) => s.mentorClassIsLoading);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);

  const fullTitle = !mentorClassIsLoading ? `Klass ${mentorClass[0]?.className}` : 'Klass';

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
      <Spinner size={2} />
    );
  return (
    <div>
      <Main>
        <FormProvider {...searchForm}>
          <HeadingMenu
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
      {!mentorClassIsLoading ? (
        <>
          {mentorClass.length !== 0 ? (
            <div className="max-w-[4000px] w-full">
              <MentorClassTable user={user} searchQuery={searchQuery} />
            </div>
          ) : (
            <p>Inga sökresultat att visa</p>
          )}
        </>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
