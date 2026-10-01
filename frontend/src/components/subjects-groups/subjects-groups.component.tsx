import { HeadingMenu, SearchTableForm } from '@components/heading-menu/heading-menu.component';
import { ForeacastQueriesDto, ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { useSnackbar } from '@sk-web-gui/react';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SubjectsTable } from './components/subjects-table/subjects-table.components';
import { CornerLoader } from '@components/corner-loader/corner-loader.component';

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
  const mySubjects = usePupilForecastStore((s) => s.mySubjects);
  const getMySubjects = usePupilForecastStore((s) => s.getMySubjects);
  const subjectsIsLoaded = usePupilForecastStore((s) => s.subjectsIsLoaded);
  const subjectsIsLoading = usePupilForecastStore((s) => s.subjectsIsLoading);
  const selectedPeriod = usePupilForecastStore((s) => s.selectedPeriod);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const fullTitle = mySubjects.totalRecords !== 0 ? `${pageTitle} (${mySubjects.totalRecords})` : pageTitle;

  const toastMessage = useSnackbar();

  const tableForm = useForm<SubjectsTableForm>({
    defaultValues: {
      sortColumn: subjectsQueries.OrderBy,
      sortOrder: subjectsQueries.OrderDirection,
      pageSize: subjectsQueries.PageSize || 10,
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
    getMySubjects({
      schoolId: selectedSchool.schoolId,
      periodId: selectedPeriod.periodId,
      PageNumber: page,
      searchFilter: searchQuery,
      PageSize: pageSize,
      OrderBy: sortColumn,
      OrderDirection: sortOrder,
    }).catch(() => {
      toastMessage({
        message: 'Något gick fel vid hämtning av alla ämnen/grupper',
        status: 'error',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, sortColumn, pageSize, page, searchQuery, selectedPeriod.periodId, selectedSchool]);

  return (
    <div>
      {subjectsIsLoading && <CornerLoader />}
      <FormProvider {...searchForm}>
        <HeadingMenu
          loaded={subjectsIsLoaded}
          pageTitle={fullTitle}
          callback="subjects"
          searchQuery={searchQuery}
          searchPlaceholder="Sök på ämne/grupp..."
        />
      </FormProvider>

      <FormProvider {...tableForm}>
        <SubjectsTable />
      </FormProvider>
    </div>
  );
};
