import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Loader from '@components/loader/loader';
import { hasRolePermission } from '@utils/has-role-permission';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { Spinner } from '@sk-web-gui/react';
import { SingleSubjectTable } from './components/single-subject-table.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

interface SubjectWithPupilsProps {
  setPageTitle: Dispatch<SetStateAction<string | undefined>>;
  pageTitle: string;
  selectedSyllabus: string | undefined;
}

export const SubjectWithPupils: React.FC<SubjectWithPupilsProps> = ({ setPageTitle, pageTitle, selectedSyllabus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const user = useUserStore((s) => s.user, shallow);
  const { teacher } = hasRolePermission(user);
  const selectedId = useForecastStore((s) => s.selectedId);
  const singleSubjectIsLoading = usePupilForecastStore((s) => s.singleSubjectIsLoading);
  const singleSubject = usePupilForecastStore((s) => s.subject);

  console.log(singleSubjectIsLoading);

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
      <HeadingMenu
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
        objectId={selectedId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på elev eller klass..."
      />
      {!singleSubjectIsLoading ? (
        <>
          {singleSubject.length !== 0 ? (
            <SingleSubjectTable user={user} searchQuery={searchQuery} selectedSyllabus={selectedSyllabus} />
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
