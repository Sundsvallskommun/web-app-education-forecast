import { SubjectsTableForm } from '@components/subjects-groups/subjects-groups.component';
import { TableFooter } from '@components/table/footer/table-footer.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useFormContext } from 'react-hook-form';
interface SubjectsTableFooterProps {
  rowHeight: 'normal' | 'dense';
  setRowHeight: (height: 'normal' | 'dense') => void;
  pages: number;
}

export const SubjectsTableFooter: React.FC<SubjectsTableFooterProps> = (props) => {
  const { rowHeight, setRowHeight, pages } = props;
  const { setValue, watch } = useFormContext<SubjectsTableForm>();
  const page = watch('page');
  const pageSize = watch('pageSize');
  const subjectsIsLoaded = usePupilForecastStore((s) => s.subjectsIsLoaded);
  const handleSetRowHeight = (value: string) => {
    if (['normal', 'dense'].includes(value)) {
      setRowHeight(value as 'normal' | 'dense');
    }
  };

  return (
    <TableFooter
      pageSize={pageSize}
      onChangePageSize={(value) => setValue('pageSize', value)}
      pages={pages}
      onChangePage={(page) => setValue('page', page)}
      activePage={page}
      rowHeight={rowHeight}
      onChangeRowHeight={handleSetRowHeight}
      loaded={subjectsIsLoaded}
    />
  );
};
