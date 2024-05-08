import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import { PupilTables } from '@components/tables/all-pupils-table.component';
import Loader from '@components/loader/loader';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { useState } from 'react';

interface AllPupilsProps {
  pageTitle: string;
}

export const AllPupils: React.FC<AllPupilsProps> = ({ pageTitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { allPupils, pupilListTable, pupilListRendered } = PupilTables(searchQuery);
  const pupilsIsLoading = useForecastStore((s) => s.pupilsIsLoading);
  const listByPeriodIsLoading = useForecastStore((s) => s.listByPeriodIsLoading);
  const fullTitle = allPupils.length !== 0 ? `${pageTitle} (${allPupils.length})` : pageTitle;

  return (
    <div>
      <HeadingMenu
        pageTitle={fullTitle}
        callback="pupils"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på elev eller klass..."
      />
      {!pupilsIsLoading && !listByPeriodIsLoading && pupilListRendered.length !== 0 ? (
        <>{pupilListTable}</>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
