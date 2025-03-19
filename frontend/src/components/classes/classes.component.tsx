import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu } from '@components/heading-menu/heading-menu.component';

import Loader from '@components/loader/loader';
import { useEffect, useState } from 'react';
import { ForeacastQueriesDto, ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { FormProvider, useForm } from 'react-hook-form';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { ClassesTable } from './components/classes-table.component';

interface ClassesProps {
  pageTitle: string;
  classQueries: ForeacastQueriesDto;
}

export interface IClassesTable {
  id: string;
  groupName: string;
  teachers: ForecastMyGroupTeacher[];
  totalPupils: number;
  presence: number | null;
  approvedPupils: number | null;
  warningPupils: number | null;
  unapprovedPupils: number | null;
  notFilledIn: number;
}

export interface ClassesTableForm {
  sortOrder: 'ASC' | 'DESC';
  sortColumn: string;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export const Classes: React.FC<ClassesProps> = ({ pageTitle, classQueries }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { myClasses, getMyClasses } = usePupilForecastStore();
  //const { myClasses, grouplistTable, groupsListRendered, grouptable } = GroupTables('K', user, searchQuery);
  //const listByPeriodIsLoading = useForecastStore((s) => s.listByPeriodIsLoading);
  const classesIsLoading = usePupilForecastStore((s) => s.classesIsLoading);
  const selectedSchool = useUserStore((s) => s.selectedSchool);

  const fullTitle = myClasses && myClasses.data.length !== 0 ? `${pageTitle} (${myClasses.data.length})` : pageTitle;

  const tableForm = useForm<ClassesTableForm>({
    defaultValues: {
      sortColumn: classQueries.OrderBy,
      sortOrder: classQueries.OrderDirection,
      pageSize: classQueries.PageSize || 10,
    },
  });

  const { watch: watchTable } = tableForm;
  const { sortOrder, sortColumn, pageSize, page } = watchTable();

  useEffect(() => {
    getMyClasses({
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
        callback="classes"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på klass..."
      />
      {!classesIsLoading && myClasses.totalRecords !== 0 ? (
        <>
          {myClasses.totalRecords !== 0 ? (
            <FormProvider {...tableForm}>
              <ClassesTable />{' '}
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
