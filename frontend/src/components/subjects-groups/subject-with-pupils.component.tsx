import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Loader from '@components/loader/loader';
import { hasRolePermission } from '@utils/has-role-permission';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { CustomPupilTable } from '@components/tables/forecast-pupil-tables.component';
import { Spinner } from '@sk-web-gui/react';

interface SubjectWithPupilsProps {
  setPageTitle: Dispatch<SetStateAction<string | undefined>>;
  pageTitle: string;
}

export const SubjectWithPupils: React.FC<SubjectWithPupilsProps> = ({ setPageTitle, pageTitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const user = useUserStore((s) => s.user, shallow);
  const { teacher } = hasRolePermission(user);
  const selectedId = useForecastStore((s) => s.selectedId);

  const { pupilTable, groupWithPupilsIsLoading, manyPupilsListRendered, groupWithPupils, pupilsInGroupData } =
    CustomPupilTable(user, false, searchQuery);

  useEffect(() => {
    !groupWithPupilsIsLoading
      ? setPageTitle(groupWithPupils[0]?.courseName || 'Ämne/grupp')
      : setPageTitle('Ämne/grupp');
  });

  const generalInformation =
    groupWithPupils.length !== 0 ? (
      <span>
        <strong>{groupWithPupils.length}</strong> elever
      </span>
    ) : (
      <Spinner size={2} />
    );

  return (
    <div>
      <HeadingMenu
        pageTitle={groupWithPupils.length !== 0 ? pageTitle : 'Ämne/grupp'}
        GeneralInformation={generalInformation}
        teachers={
          teacher && groupWithPupils[0]?.teachers?.find((x) => x.personId === user.personId)
            ? [
                {
                  givenname: user.name.split(' ')[0],
                  lastname: user.name.split(' ')[1],
                  personId: user.personId,
                  email: user.username,
                },
              ]
            : groupWithPupils[0]?.teachers
        }
        callback="subject"
        objectId={selectedId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på elev eller klass..."
      />
      {!groupWithPupilsIsLoading && pupilsInGroupData.length !== 0 ? (
        <>{manyPupilsListRendered.length !== 0 ? pupilTable : <p>Inga sökresultat att visa</p>}</>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
