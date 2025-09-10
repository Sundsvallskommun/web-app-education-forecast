import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import Loader from '@components/loader/loader';
import { useEffect } from 'react';
import { ForeacastQueriesDto, ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { FormProvider, useForm } from 'react-hook-form';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { AllPupilsTable } from './components/all-pupils-table.components';
import { useSnackbar } from '@sk-web-gui/react';

interface AllPupilsProps {
  pageTitle: string;
  pupilsQueries: ForeacastQueriesDto;
}

export interface IAllPupilsTable {
  id?: string | null;
  pupil?: string | null;
  className?: string | null;
  groupId?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
  presence?: number | null;
  forecast?: number | null;
  approved?: number | null;
  warnings?: number | null;
  unapproved?: number | null;
  notFilledIn: number | null;
  totalSubjects?: number | null;
  image?: string | null;
}

export interface PupilsTableForm {
  sortOrder: 'ASC' | 'DESC';
  sortColumn: string;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export const AllPupils: React.FC<AllPupilsProps> = ({ pageTitle, pupilsQueries }) => {
  const pupilsIsLoading = usePupilForecastStore((s) => s.pupilsIsLoading);
  const getAllPupils = usePupilForecastStore((s) => s.getAllPupils);
  const allPupils = usePupilForecastStore((s) => s.allPupils);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const fullTitle = allPupils.totalRecords !== 0 ? `${pageTitle} (${allPupils.totalRecords})` : pageTitle;

  const toastMessage = useSnackbar();

  const tableForm = useForm<PupilsTableForm>({
    defaultValues: {
      sortColumn: pupilsQueries.OrderBy,
      sortOrder: pupilsQueries.OrderDirection,
      pageSize: pupilsQueries.PageSize || 10,
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
    getAllPupils({
      schoolId: selectedSchool.schoolId,
      periodId: selectedPeriod.periodId,
      PageNumber: page,
      searchFilter: searchQuery,
      PageSize: pageSize,
      OrderBy: sortColumn,
      OrderDirection: sortOrder,
    }).catch(() => {
      toastMessage({
        message: 'Något gick fel vid hämtning av alla elever',
        status: 'error',
      });
    });

    //eslint-disable-next-line
  }, [sortOrder, sortColumn, pageSize, page, searchQuery, selectedPeriod.periodId, selectedSchool]);

  return (
    <div>
      <FormProvider {...searchForm}>
        <HeadingMenu
          pageTitle={fullTitle}
          callback="pupils"
          searchQuery={searchQuery}
          searchPlaceholder="Sök på elev eller klass..."
        />
      </FormProvider>
      {!pupilsIsLoading ? (
        <>
          {allPupils.totalRecords !== 0 ? (
            <FormProvider {...tableForm}>
              <AllPupilsTable />
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
