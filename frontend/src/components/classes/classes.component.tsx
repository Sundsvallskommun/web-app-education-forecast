import { shallow } from 'zustand/shallow';
import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import { GroupTables } from '@components/tables/group-tables.component';
import Loader from '@components/loader/loader';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useState } from 'react';

interface ClassesProps {
  pageTitle: string;
}

export const Classes: React.FC<ClassesProps> = ({ pageTitle }) => {
  const user = useUserStore((s) => s.user as User, shallow);
  const [searchQuery, setSearchQuery] = useState('');
  const { myClasses, grouplistTable, groupsListRendered, grouptable } = GroupTables('K', user, searchQuery);
  //const listByPeriodIsLoading = useForecastStore((s) => s.listByPeriodIsLoading);
  const classesIsLoading = useForecastStore((s) => s.classesIsLoading);

  const fullTitle = myClasses.length !== 0 ? `${pageTitle} (${myClasses.length})` : pageTitle;

  return (
    <div>
      <HeadingMenu
        pageTitle={fullTitle}
        callback="classes"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på klass..."
      />
      {!classesIsLoading && grouptable.length !== 0 ? (
        <>{groupsListRendered.length !== 0 ? grouplistTable : <p>Inga sökresultat att visa</p>}</>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
