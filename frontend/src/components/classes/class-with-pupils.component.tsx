import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import Loader from '@components/loader/loader';
import { hasRolePermission } from '@utils/has-role-permission';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useState } from 'react';
import { MentorClassTable } from '@components/tables/mentor-class-table.component';
import { Spinner } from '@sk-web-gui/react';

export const ClassWithPupils: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const [searchQuery, setSearchQuery] = useState('');
  const listByPeriodIsLoading = useForecastStore((s) => s.listByPeriodIsLoading);
  const { mentor } = hasRolePermission(user);
  const { mentorclassTable, mentorClass, mentorClassIsLoading, mentorClassListRendered, mentorClassData } =
    MentorClassTable(user, searchQuery);

  const fullTitle = !mentorClassIsLoading ? `Klass ${mentorClass[0]?.className}` : 'Klass';

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
      <HeadingMenu
        pageTitle={fullTitle}
        GeneralInformation={generalInformation}
        teachers={
          mentor && mentorClass[0]?.teachers.find((x) => x.personId === user.personId)
            ? [
                {
                  givenname: user.name.split(' ')[0],
                  lastname: user.name.split(' ')[1],
                  personId: user.personId,
                  email: user.username,
                },
              ]
            : mentorClass[0]?.teachers
        }
        callback="mentorclass"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på elev..."
      />
      {!mentorClassIsLoading && !listByPeriodIsLoading && mentorClassData.length !== 0 ? (
        <>{mentorClassListRendered.length !== 0 ? mentorclassTable : <p>Inga sökresultat att visa</p>}</>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
