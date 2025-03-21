import { User } from '@interfaces/user';
import { Link, SortMode, Table, Select, Pagination, Input, Icon } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';
import { GridForecast, Pupil, KeyStringTable } from '@interfaces/forecast/forecast';
import { searchFilter } from '@utils/search';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';

interface MentorClassHeaders {
  label: string;
  property: string;
  isColumnSortable: boolean;
}
interface IMentorClassTable {
  user: User;
  searchQuery: string;
}

export const MentorClassTable: React.FC<IMentorClassTable> = ({ user, searchQuery }) => {
  const { headmaster, mentor } = hasRolePermission(user);
  const [pageSize] = useState<number>(mentor || headmaster ? 100 : 10);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);
  const [mentorClassData, setMentorClassData] = useState<KeyStringTable[]>([]);
  const [subjectHeaders, setSubjectHeaders] = useState<MentorClassHeaders[]>([]);

  useEffect(() => {
    const tableArr: KeyStringTable[] = [];
    const subjectArr: MentorClassHeaders[] = [];
    if (mentorClass.length !== 0) {
      mentorClass.map((p) => {
        const allSubjects = p.forecasts?.reduce((accumulator: GridForecast[], current) => {
          if (!accumulator.find((item: GridForecast) => item.courseId === current.courseId)) {
            accumulator.push(current);
          }
          return accumulator;
        }, []);

        allSubjects?.forEach((s) => {
          if (!subjectArr.find((x) => x.label === s.courseId))
            subjectArr.push({ label: s.courseId, property: s.courseId, isColumnSortable: true });
        });

        const numberNotFilledIn = p.forecasts?.filter((x) => x.forecast === null).length;
        const object = {
          id: p.pupil,
          pupil: `${p.givenname} ${p.lastname}`,
          unitId: p.unitId,
          className: p.className,
          presence: p.presence,
          notFilledIn: numberNotFilledIn,
        };

        p.forecasts?.map((f) => {
          const forecastObj = {
            [f.courseId]: f.forecast,
          };
          Object.assign(object, forecastObj);
        });

        tableArr.push(object);
      });
    }

    setSubjectHeaders(subjectArr);
    setMentorClassData(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorClass]);

  const [_pageSize, setPageSize] = useState<number>(pageSize);

  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowHeight, setRowHeight] = useState<string>('normal');

  const [sortColumn, setSortColumn] = useState<string>('pupil');

  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const mentorclassGridHeaderLabels = [{ label: 'Namn', property: 'pupil', isColumnSortable: true }, ...subjectHeaders];

  const classHeaderLabels = mentorclassGridHeaderLabels;

  const mentorClassHeaders = classHeaderLabels.map((h, idx) => {
    return (
      <Table.HeaderColumn
        sticky={h.label === 'Namn'}
        className={`${idx !== 0 && (mentor || headmaster) ? 'flex justify-center border-r-1 !border-gray-200 !pl-4 !pr-4 !py-0' : null}`}
        key={`headercol-${idx}`}
        aria-sort={sortColumn === h.property ? sortOrder : 'none'}
      >
        {idx === 0 ? (
          <div className={`${mentor || (headmaster && 'min-w-[174px]')}`}>
            <Table.SortButton
              isActive={sortColumn === h.property}
              aria-description={sortColumn === h.property ? undefined : 'sortera'}
              sortOrder={sortOrder}
              onClick={() => handleSort(h.property)}
            >
              {h.label}
            </Table.SortButton>
          </div>
        ) : (
          <div>
            <span className="block">{h.label.slice(0, 4)}</span>
            <span>{h.label.slice(4)}</span>
          </div>
        )}
      </Table.HeaderColumn>
    );
  });

  const mentorclassSearchFilter = (q: string, obj: KeyStringTable | Pupil) => {
    if (obj.pupil == '' && obj.pupil?.toLowerCase().includes(q)) {
      return true; // pupil
    } else {
      return false;
    }
  };

  const mentorClassListSearchFiltered = mentorClassData.filter(
    searchFilter(searchQuery ? searchQuery : '', mentorclassSearchFilter)
  );

  const mentorClassListRendered: KeyStringTable[] | string[] = mentorClassListSearchFiltered;

  const iconType = (prop: number) => {
    if (prop === 1) {
      return 'check';
    } else if (prop === 2) {
      return 'minus';
    } else if (prop === 3) {
      return 'x';
    }
  };

  const iconColor = (prop: number) => {
    if (prop === 1) {
      return 'gronsta';
    } else if (prop === 2) {
      return 'warning';
    } else if (prop === 3) {
      return 'error';
    }
  };

  console.log(mentorClass);

  const mentorclassRows = mentorClassListRendered
    .sort((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return `${a[sortColumn]}` < `${b[sortColumn]}` ? order : `${a[sortColumn]}` > `${b[sortColumn]}` ? order * -1 : 0;
    })
    .slice((currentPage - 1) * _pageSize, currentPage * _pageSize)
    .map((p, idx: number) => {
      return (
        <Table.Row
          key={`row-${idx}`}
          className={`${
            p.forecast === 1 && 'border-b-1 border-gray-300 bg-success-background-200 hover:bg-success-background-100'
          } ${
            p.forecast === 2 && 'border-b-1 border-gray-300 bg-warning-background-200 hover:bg-warning-background-100'
          } ${p.forecast === 3 && 'border-b-1 border-gray-300 bg-error-background-200 hover:bg-error-background-100'}`}
        >
          <Table.HeaderColumn scope="row" sticky>
            <div className="flex flex-col py-2 gap-6 min-w-[177px]">
              <span>
                {headmaster ? (
                  <Link href={`/klasser/klass/elev/${p.id}`}>{p.pupil}</Link>
                ) : p.notFilledIn === undefined || p.notFilledIn === null ? (
                  <span>{typeof p.pupil === 'string' && p.pupil} </span>
                ) : (
                  <Link href={`/min-mentorsklass/elev/${p.id}`}>{p.pupil}</Link>
                )}
              </span>
              <span>Närvaro: {typeof p.presence === 'number' && p.presence}%</span>
            </div>
          </Table.HeaderColumn>
          {subjectHeaders.map((s, index) => {
            return (
              <Table.Column key={index} className={`${index === 0 ? 'border-l-1' : null} border-r-1 !p-0`}>
                <div className="w-full flex justify-center items-center">
                  {s.label in p ? (
                    p[s.label] !== null ? (
                      <Icon.Padded
                        inverted
                        color={iconColor(Number(p[s.label]))}
                        rounded
                        name={iconType(Number(p[s.label]))}
                      />
                    ) : (
                      <Icon size={14} name="minus" />
                    )
                  ) : (
                    ''
                  )}
                </div>
              </Table.Column>
            );
          })}
        </Table.Row>
      );
    });

  const footer = (
    <Table.Footer
      className={mentorclassRows.length > pageSize ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''}
    >
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
          Rader per sida:
        </label>
        <Input
          size="sm"
          id="pagePageSize"
          type="number"
          min={1}
          max={100}
          className="max-w-[6rem]"
          value={`${_pageSize}`}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            event.target.value && setPageSize(parseInt(event.target.value))
          }
        />
      </div>

      <div className="sk-table-paginationwrapper">
        <Pagination
          className="sk-table-pagination"
          pages={Math.ceil(mentorClassListRendered.length / _pageSize)}
          activePage={currentPage}
          showConstantPages
          pagesAfter={1}
          pagesBefore={1}
          changePage={(page: number) => setCurrentPage(page)}
          fitContainer
        />
      </div>
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiRowHeight">
          Radhöjd:
        </label>
        <Select id="pagiRowHeight" size="sm" value={rowHeight} onSelectValue={(value: string) => setRowHeight(value)}>
          <Select.Option value={'normal'}>Normal</Select.Option>
          <Select.Option value={'dense'}>Tät</Select.Option>
        </Select>
      </div>
    </Table.Footer>
  );

  return (
    <Table
      scrollable
      dense={rowHeight === 'dense'}
      background={true}
      className={`${mentorclassRows.length > 10 && 'h-[800px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {mentorClassHeaders}
      </Table.Header>
      <Table.Body>{mentorclassRows}</Table.Body>
      {footer}
    </Table>
  );
};
