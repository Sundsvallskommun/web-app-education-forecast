import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import { useUserStore } from '@services/user-service/user-service';
import { CornerLoader } from '@components/corner-loader/corner-loader.component';
import { ForeacastQueriesDto, ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useSnackbar } from '@sk-web-gui/react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
  const myClasses = usePupilForecastStore((s) => s.myClasses);
  const getMyClasses = usePupilForecastStore((s) => s.getMyClasses);
  const classesIsLoading = usePupilForecastStore((s) => s.classesIsLoading);
  const classesIsLoaded = usePupilForecastStore((s) => s.classesIsLoaded);
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
      {classesIsLoading && <CornerLoader />}
      <FormProvider {...searchForm}>
        <HeadingMenu
          loaded={classesIsLoaded}
          pageTitle={fullTitle}
          callback="classes"
          searchQuery={searchQuery}
          searchPlaceholder="Sök på klass..."
        />
      </FormProvider>

      <FormProvider {...tableForm}>
        <ClassesTable />
      </FormProvider>
    </div>
  );
};
