import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import Loader from '@components/loader/loader';
import { useEffect, useState } from 'react';
import { ForeacastQueriesDto, ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { useForm, FormProvider } from 'react-hook-form';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { SubjectsTable } from './components/subjects-table.components';

interface SubjectsGroupsProps {
  pageTitle: string;
  subjectsQueries: ForeacastQueriesDto;
}

export interface SubjectsTableForm {
  sortOrder: 'ASC' | 'DESC';
  sortColumn: string;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export interface ISubjectsTable {
  id: string | null;
  groupName: string | null;
  teachers: ForecastMyGroupTeacher[] | null;
  totalPupils: number | null;
  presence: number | null;
  approvedPupils: number | null;
  warningPupils: number | null;
  unapprovedPupils: number | null;
  notFilledIn: number | null;
}

export const SubjectsGroups: React.FC<SubjectsGroupsProps> = ({ pageTitle, subjectsQueries }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { mySubjects, getMySubjects } = usePupilForecastStore();
  //const { mySubjects, grouplistTable, groupsListRendered, grouptable } = GroupTables('G', user, searchQuery);
  const subjectsIsLoading = usePupilForecastStore((s) => s.subjectsIsLoading);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const fullTitle = mySubjects.totalRecords !== 0 ? `${pageTitle} (${mySubjects.totalRecords})` : pageTitle;

  const tableForm = useForm<SubjectsTableForm>({
    defaultValues: {
      sortColumn: subjectsQueries.OrderBy,
      sortOrder: subjectsQueries.OrderDirection,
      pageSize: subjectsQueries.PageSize || 10,
    },
  });

  const { watch: watchTable } = tableForm;
  const { sortOrder, sortColumn, pageSize, page } = watchTable();

  useEffect(() => {
    getMySubjects({
      schoolId: selectedSchool.schoolId,
      PageNumber: page,
      PageSize: pageSize,
      OrderBy: sortColumn,
      OrderDirection: sortOrder,
    });

    //eslint-disable-next-line
  }, [sortOrder, sortColumn, pageSize, page]);
  return (
    <div>
      <HeadingMenu
        pageTitle={fullTitle}
        callback="subjects"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på ämne/grupp..."
      />
      {!subjectsIsLoading && mySubjects.totalRecords !== 0 ? (
        <>
          {mySubjects.totalRecords !== 0 ? (
            <FormProvider {...tableForm}>
              <SubjectsTable />
            </FormProvider>
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
