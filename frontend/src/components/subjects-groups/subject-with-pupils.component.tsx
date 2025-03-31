import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Loader from '@components/loader/loader';
import { hasRolePermission } from '@utils/has-role-permission';
import { Spinner } from '@sk-web-gui/react';
import { SingleSubjectTable } from './components/single-subject-table.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { FormProvider, useForm } from 'react-hook-form';

interface SubjectWithPupilsProps {
  setPageTitle: Dispatch<SetStateAction<string | undefined>>;
  pageTitle: string;
  selectedSyllabus: string | undefined;
}

export const SubjectWithPupils: React.FC<SubjectWithPupilsProps> = ({ setPageTitle, pageTitle, selectedSyllabus }) => {
  const user = useUserStore((s) => s.user, shallow);
  const { teacher } = hasRolePermission(user);
  const singleSubjectIsLoading = usePupilForecastStore((s) => s.singleSubjectIsLoading);
  const singleSubject = usePupilForecastStore((s) => s.subject);

  console.log(singleSubjectIsLoading);
  const searchForm = useForm<SearchTableForm>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const { watch: watchSearch } = searchForm;
  const { searchQuery } = watchSearch();

  useEffect(() => {
    !singleSubjectIsLoading
      ? setPageTitle(singleSubject[0]?.courseName ? singleSubject[0]?.courseName : '')
      : setPageTitle('Ämne/grupp');
  }, [singleSubjectIsLoading, singleSubject]);

  const generalInformation =
    singleSubject.length !== 0 ? (
      <span>
        <strong>{singleSubject.length}</strong> elever
      </span>
    ) : (
      <Spinner size={2} />
    );

  return (
    <div>
      <FormProvider {...searchForm}>
        <HeadingMenu
          syllabusId={selectedSyllabus}
          pageTitle={singleSubject.length !== 0 ? pageTitle : 'Ämne/grupp'}
          GeneralInformation={generalInformation}
          teachers={
            teacher && singleSubject[0]?.teachers?.find((x) => x.personId === user.personId)
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
      {!singleSubjectIsLoading ? (
        <>
          {singleSubject.length !== 0 ? (
            <SingleSubjectTable user={user} searchQuery={searchQuery} selectedSyllabus={selectedSyllabus || ''} />
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
