import { User } from '@interfaces/user';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { Avatar, Badge, Link, SortMode, Table, Select, Pagination, Input } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';
import { initialsFunction } from '@utils/initials';
import { Pupil } from '@interfaces/forecast/forecast';
import { searchFilter } from '@utils/search';

export const MentorClassTable = (user: User, searchQuery?: string) => {
  const [pageSize] = useState<number>(10);
  const mentorClass = useForecastStore((s) => s.mentorClass);
  const mentorClassIsLoading = useForecastStore((s) => s.mentorClassIsLoading);
  const { headmaster } = hasRolePermission(user);
  const [mentorClassData, setMentorClassData] = useState([]);

  useEffect(() => {
    const tableArr = [];
    if (mentorClass.length !== 0) {
      mentorClass.map((p) => {
        const numberNotFilledIn = p.totalSubjects - p.approved - p.warnings - p.unapproved;
        tableArr.push({
          id: p.pupil,
          pupil: `${p.givenname} ${p.lastname}`,
          className: p.className,
          presence: p.presence,
          approved: p.approved,
          warnings: p.warnings,
          unapproved: p.unapproved,
          schoolYear: p.schoolYear,
          notFilledIn: numberNotFilledIn,
          totalSubjects: p.totalSubjects,
          image: p.image,
        });
      });
    }

    setMentorClassData(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorClass]);

  const [_pageSize, setPageSize] = useState<number>(pageSize);
  const [sortColumn, setSortColumn] = useState<string>('pupil');
  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowHeight, setRowHeight] = useState<string>('normal');

  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const mentorclassHeaderLabels = [
    { label: 'Namn', property: 'pupil', isColumnSortable: true },
    { label: 'Närvaro', property: 'presence', isColumnSortable: true },
    { label: 'Når målen', property: 'approved', isColumnSortable: true },
    { label: 'Varning', property: 'warnings', isColumnSortable: true },
    { label: 'Når ej målen', property: 'unapproved', isColumnSortable: true },
    { label: 'Inte ifyllda', property: 'notFilledIn', isColumnSortable: true },
  ];

  const mentorClassHeaders = mentorclassHeaderLabels.map((h, idx) => {
    return (
      <Table.HeaderColumn key={`headercol-${idx}`} aria-sort={sortColumn === h.property ? sortOrder : 'none'}>
        <Table.SortButton
          isActive={sortColumn === h.property}
          aria-description={sortColumn === h.property ? undefined : 'sortera'}
          sortOrder={sortOrder}
          onClick={() => handleSort(h.property)}
        >
          {h.label}
        </Table.SortButton>
      </Table.HeaderColumn>
    );
  });

  const mentorclassSearchFilter = (q: string, obj: Pupil) => {
    if (obj.pupil?.toLowerCase().includes(q)) {
      return true; // pupil
    } else {
      return false;
    }
  };

  const mentorClassListSearchFiltered = mentorClassData.filter(searchFilter(searchQuery, mentorclassSearchFilter));

  const mentorClassListRendered = mentorClassListSearchFiltered;

  const mentorclassRows = mentorClassListRendered
    .sort((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return a[sortColumn] < b[sortColumn] ? order : a[sortColumn] > b[sortColumn] ? order * -1 : 0;
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
          <Table.HeaderColumn scope="row">
            <div className="flex items-center gap-2">
              <Avatar
                imageUrl={`${p.image.length !== 0 || p.image ? p.image : ''}`}
                color="vattjom"
                rounded
                initials={initialsFunction(p.pupil)}
                size="sm"
                accent
              />
              <span className="ml-8 font-bold">
                {headmaster ? (
                  <Link href={`/klasser/klass/elev/${p.id}`}>{p.pupil}</Link>
                ) : (
                  <span>
                    <Link href={`/min-mentorsklass/elev/${p.id}`}>{p.pupil}</Link>
                  </span>
                )}
              </span>
            </div>
          </Table.HeaderColumn>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">{!p.presence ? '-' : `${p.presence}%`}</span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                {p.totalSubjects === p.notFilledIn ? (
                  '-'
                ) : (
                  <Badge
                    inverted
                    rounded
                    color={!p.approved || p.approved === 0 ? 'tertiary' : 'gronsta'}
                    counter={p.approved == 0 ? 0 : p.approved}
                  />
                )}
              </span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                {p.totalSubjects === p.notFilledIn ? (
                  '-'
                ) : (
                  <Badge
                    rounded
                    inverted={!p.warnings || p.warnings === 0}
                    color={!p.warnings || p.warnings === 0 ? 'tertiary' : 'warning'}
                    counter={p.warnings == 0 ? 0 : p.warnings}
                  />
                )}
              </span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                {p.totalSubjects === p.notFilledIn ? (
                  '-'
                ) : (
                  <Badge
                    rounded
                    inverted={!p.unapproved || p.unapproved === 0}
                    color={!p.unapproved || p.unapproved === 0 ? 'tertiary' : 'error'}
                    counter={p.unapproved == 0 ? 0 : p.unapproved}
                  />
                )}
              </span>
            </div>
          </Table.Column>

          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                {' '}
                <Badge
                  rounded
                  inverted={!p.notFilledIn}
                  color="tertiary"
                  counter={!p.notFilledIn ? 0 : p.notFilledIn}
                />
              </span>
            </div>
          </Table.Column>
        </Table.Row>
      );
    });

  const footer = (
    <Table.Footer className={mentorclassRows.length > 10 && 'border-0 outline outline-1 outline-gray-300 rounded-b-18'}>
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

  const mentorclassTable = (
    <Table
      dense={rowHeight === 'dense'}
      background={true}
      className={`${mentorclassRows.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {mentorClassHeaders}
      </Table.Header>
      <Table.Body>{mentorclassRows}</Table.Body>
      {footer}
    </Table>
  );

  return {
    mentorclassTable,
    mentorClassData,
    mentorClass,
    mentorClassIsLoading,
    mentorClassListRendered,
  };
};
