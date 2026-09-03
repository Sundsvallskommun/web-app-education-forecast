import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { hasRolePermission } from '@utils/has-role-permission';
import { SingleSubjectTable } from './components/single-subject-table.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { FormProvider, useForm } from 'react-hook-form';
import { Skeleton } from '@components/skeleton/skeleton.component';
import { CornerLoader } from '@components/corner-loader/corner-loader.component';

interface SubjectWithPupilsProps {
  setPageTitle: Dispatch<SetStateAction<string | undefined>>;
  pageTitle: string;
  selectedSyllabus: string | undefined;
}

export const SubjectWithPupils: React.FC<SubjectWithPupilsProps> = ({ setPageTitle, pageTitle, selectedSyllabus }) => {
  const user = useUserStore((s) => s.user);
  const { teacher } = hasRolePermission(user);
  const singleSubjectIsLoading = usePupilForecastStore((s) => s.singleSubjectIsLoading);
  const singleSubjectIsLoaded = usePupilForecastStore((s) => s.singleSubjectIsLoaded);
  const singleSubject = usePupilForecastStore((s) => s.subject);

  const searchForm = useForm<SearchTableForm>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const { watch: watchSearch } = searchForm;
  const { searchQuery } = watchSearch();

  useEffect(() => {
    if (singleSubjectIsLoaded) {
      setPageTitle(singleSubject[0]?.courseName ? singleSubject[0]?.courseName : '');
    } else {
      setPageTitle('');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleSubjectIsLoaded, singleSubject]);

  const generalInformation =
    singleSubject.length !== 0 ? (
      <span>
        <strong>{singleSubject.length}</strong> elever
      </span>
    ) : (
      <Skeleton className="h-24">Laddar elever</Skeleton>
    );

  return (
    <div>
      {singleSubjectIsLoading && <CornerLoader />}
      <FormProvider {...searchForm}>
        <HeadingMenu
          loaded={singleSubjectIsLoaded}
          syllabusId={selectedSyllabus}
          pageTitle={singleSubject.length !== 0 ? pageTitle : 'Ämne/grupp'}
          GeneralInformation={generalInformation}
          teachers={
            teacher
              ? [
                  {
                    givenname: user.name.split(' ')[0],
                    lastname: user.name.split(' ')[1],
                    personId: user.personId,
                    email: user.username,
                  },
                ]
              : singleSubject[0]?.teachers
          }
          callback="subject"
          searchQuery={searchQuery}
          searchPlaceholder="Sök på elev eller klass..."
        />
      </FormProvider>

      <SingleSubjectTable
        loaded={singleSubjectIsLoaded}
        user={user}
        searchQuery={searchQuery}
        selectedSyllabus={selectedSyllabus || ''}
      />
    </div>
  );
};
