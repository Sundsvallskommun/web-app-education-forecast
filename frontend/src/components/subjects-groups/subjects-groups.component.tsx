import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import { GroupTables } from '@components/tables/group-tables.component';
import Loader from '@components/loader/loader';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useState } from 'react';

interface SubjectsGroupsProps {
  pageTitle: string;
}

export const SubjectsGroups: React.FC<SubjectsGroupsProps> = ({ pageTitle }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const user = useUserStore((s) => s.user, shallow);
  const { mySubjects, grouplistTable, groupsListRendered, grouptable } = GroupTables('G', user, searchQuery);
  const listByPeriodIsLoading = useForecastStore((s) => s.listByPeriodIsLoading);
  const subjectsIsLoading = useForecastStore((s) => s.subjectsIsLoading);

  const fullTitle = mySubjects.length !== 0 ? `${pageTitle} (${mySubjects.length})` : pageTitle;

  return (
    <div>
      <HeadingMenu
        pageTitle={fullTitle}
        callback="subjects"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på ämne/grupp..."
      />
      {!subjectsIsLoading && !listByPeriodIsLoading && grouptable.length !== 0 ? (
        <>{groupsListRendered.length !== 0 ? grouplistTable : <p>Inga sökresultat att visa</p>}</>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
