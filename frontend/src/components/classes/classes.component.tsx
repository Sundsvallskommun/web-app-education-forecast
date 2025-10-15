import { useUserStore } from '@services/user-service/user-service';
import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';

import Loader from '@components/loader/loader';
import { useEffect } from 'react';
import { ForeacastQueriesDto, ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { FormProvider, useForm } from 'react-hook-form';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { ClassesTable } from './components/classes-table.component';
import { useSnackbar } from '@sk-web-gui/react';

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
  const { myClasses, getMyClasses } = usePupilForecastStore();
  const classesIsLoading = usePupilForecastStore((s) => s.classesIsLoading);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const selectedSchool = useUserStore((s) => s.selectedSchool);

  const toastMessage = useSnackbar();

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

  const searchForm = useForm<SearchTableForm>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const { watch: watchSearch } = searchForm;
  const { searchQuery } = watchSearch();

  useEffect(() => {
    getMyClasses({
      schoolId: selectedSchool.schoolId,
      periodId: selectedPeriod.periodId,
      PageNumber: page,
      searchFilter: searchQuery,
      PageSize: pageSize,
      OrderBy: sortColumn,
      OrderDirection: sortOrder,
    }).catch(() => {
      toastMessage({
        message: 'Något gick fel vid hämtning av alla klasser',
        status: 'error',
      });
    });

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, sortColumn, pageSize, page, searchQuery, selectedPeriod.periodId, selectedSchool]);

  return (
    <div>
      <FormProvider {...searchForm}>
        <HeadingMenu
          pageTitle={fullTitle}
          callback="classes"
          searchQuery={searchQuery}
          searchPlaceholder="Sök på klass..."
        />
      </FormProvider>
      {!classesIsLoading ? (
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
