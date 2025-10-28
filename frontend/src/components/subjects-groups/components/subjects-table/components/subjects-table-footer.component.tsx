import { SubjectsTableForm } from '@components/subjects-groups/subjects-groups.component';
import { Input, Pagination, Select } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
interface SubjectsTableFooterProps {
  rowHeight: 'normal' | 'dense';
  setRowHeight: (height: 'normal' | 'dense') => void;
  pages: number;
}

export const SubjectsTableFooter: React.FC<SubjectsTableFooterProps> = (props) => {
  const { rowHeight, setRowHeight, pages } = props;
  const { setValue, register, watch } = useFormContext<SubjectsTableForm>();
  const page = watch('page');

  const handleSetRowHeight = (value: string) => {
    if (['normal', 'dense'].includes(value)) {
      setRowHeight(value as 'normal' | 'dense');
    }
  };

  return (
    <>
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
          Rader per sida:
        </label>
        <Input
          {...register('pageSize')}
          size="sm"
          id="pageSize"
          type="number"
          min={1}
          max={1000}
          className="max-w-[6rem]"
        />
      </div>

      <div className="sk-table-paginationwrapper">
        <Pagination
          className="sk-table-pagination"
          showFirst
          showLast
          pages={pages}
          activePage={page}
          showConstantPages
          pagesAfter={1}
          pagesBefore={1}
          changePage={(page) => {
            setValue('page', page === 1 ? 1 : page);
          }}
          fitContainer
        />
      </div>
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiRowHeight">
          Radhöjd:
        </label>
        <Select id="pagiRowHeight" size="sm" value={rowHeight} onSelectValue={handleSetRowHeight}>
          <Select.Option value={'normal'}>Normal</Select.Option>
          <Select.Option value={'dense'}>Tät</Select.Option>
        </Select>
      </div>
    </>
  );
};
