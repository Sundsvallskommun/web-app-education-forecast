import { HeadingMenu } from '@components/heading-menu/heading-menu.component';
import Loader from '@components/loader/loader';
import { useEffect, useState } from 'react';
import { ForeacastQueriesDto, ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { FormProvider, useForm } from 'react-hook-form';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { AllPupilsTable } from './components/all-pupils-table.components';

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
  const [searchQuery, setSearchQuery] = useState('');
  const pupilsIsLoading = usePupilForecastStore((s) => s.pupilsIsLoading);
  const getAllPupils = usePupilForecastStore((s) => s.getAllPupils);
  const allPupils = usePupilForecastStore((s) => s.allPupils);
  const selectedSchool = useUserStore((s) => s.selectedSchool);
  const fullTitle = allPupils.totalRecords !== 0 ? `${pageTitle} (${allPupils.totalRecords})` : pageTitle;

  const tableForm = useForm<PupilsTableForm>({
    defaultValues: {
      sortColumn: pupilsQueries.OrderBy,
      sortOrder: pupilsQueries.OrderDirection,
      pageSize: pupilsQueries.PageSize || 10,
    },
  });

  const { watch: watchTable } = tableForm;
  const { sortOrder, sortColumn, pageSize, page } = watchTable();

  useEffect(() => {
    getAllPupils({
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
        callback="pupils"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Sök på elev eller klass..."
      />
      {!pupilsIsLoading && allPupils.totalRecords !== 0 ? (
        <FormProvider {...tableForm}>
          <AllPupilsTable />
        </FormProvider>
      ) : (
        <div className="h-[500px] flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
