import { Skeleton } from '@components/skeleton/skeleton.component';
import { Input, Pagination, Select } from '@sk-web-gui/react';

interface TableFooterProps {
  loaded: boolean;
  pageSize: number;
  onChangePageSize: (value: number) => void;
  pages: number;
  activePage: number;
  onChangePage: (page: number) => void;
  rowHeight: string;
  onChangeRowHeight: (rowHeight: string) => void;
}

export const TableFooter: React.FC<TableFooterProps> = (props) => {
  const { loaded, onChangePage, onChangePageSize, onChangeRowHeight, pageSize, pages, rowHeight, activePage } = props;

  return (
    <>
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
          Rader per sida:
        </label>
        <Input
          size="sm"
          id="pagiPageSize"
          disabled={!loaded}
          type="number"
          min={1}
          max={100}
          className="max-w-[6rem]"
          value={`${pageSize}`}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            event.target.value && onChangePageSize(Number.parseInt(event.target.value))
          }
        />
      </div>

      <div className="sk-table-paginationwrapper">
        {loaded ? (
          <Pagination
            className="sk-table-pagination"
            pages={pages}
            activePage={activePage}
            showConstantPages
            pagesAfter={1}
            pagesBefore={1}
            changePage={onChangePage}
            fitContainer
          />
        ) : (
          <Skeleton className="h-32 w-[48rem]">Laddar sidor</Skeleton>
        )}
      </div>
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiRowHeight">
          Radhöjd:
        </label>
        <Select disabled={!loaded} id="pagiRowHeight" size="sm" value={rowHeight} onSelectValue={onChangeRowHeight}>
          <Select.Option value={'normal'}>Normal</Select.Option>
          <Select.Option value={'dense'}>Tät</Select.Option>
        </Select>
      </div>
    </>
  );
};
