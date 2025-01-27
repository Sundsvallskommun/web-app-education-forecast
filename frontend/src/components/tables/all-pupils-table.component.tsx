import { useForecastStore } from '@services/forecast-service/forecats-service';
import { Avatar, Link, Table, SortMode, Pagination, Select, Input, Badge } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { initialsFunction } from '@utils/initials';
import { ForecastMyGroupTeacher, Pupil, KeyStringTable } from '@interfaces/forecast/forecast';
import { searchFilter } from '@utils/search';
export interface AllPupils {
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

interface PupilHeaders {
  label: string;
  property: keyof AllPupils;
  isColumnSortable: boolean;
}

export const PupilTables = (searchQuery?: string) => {
  const allPupils = useForecastStore((s) => s.allPupils);
  const [allPupilsTable, setAllPupilTable] = useState<KeyStringTable[]>([]);
  const [pageSize] = useState<number>(999);

  useEffect(() => {
    const tableArr: KeyStringTable[] = [];
    if (allPupils.length !== 0) {
      allPupils.map((p) => {
        const numberNotFilledIn =
          (p?.totalSubjects || 0) - (p?.approved || 0) - (p?.warnings || 0) - (p?.unapproved || 0);
        tableArr.push({
          id: p.pupil,
          pupil: `${p.givenname} ${p.lastname}`,
          className: p.className,
          groupId: p.groupId,
          teachers: p.teachers,
          presence: p.presence,
          forecast: p.forecast,
          approved: p.approved,
          warnings: p.warnings,
          unapproved: p.unapproved,
          notFilledIn: numberNotFilledIn,
          totalSubjects: p.totalSubjects,
          image: p.image,
        });
      });
    }

    setAllPupilTable(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPupils]);

  const [_pageSize, setPageSize] = useState<number>(pageSize);
  const [sortColumn, setSortColumn] = useState<keyof AllPupils>('pupil');
  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowHeight, setRowHeight] = useState<string>('normal');

  const handleSort = (column: keyof AllPupils) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const pupilHeaderLabels: PupilHeaders[] = [
    { label: 'Namn', property: 'pupil', isColumnSortable: true },
    { label: 'Klass', property: 'className', isColumnSortable: true },
    { label: 'mentor', property: 'teachers', isColumnSortable: true },
    { label: 'Närvaro', property: 'presence', isColumnSortable: true },
    { label: 'Når målen', property: 'approved', isColumnSortable: true },
    { label: 'Varning', property: 'warnings', isColumnSortable: true },
    { label: 'Når ej målen', property: 'unapproved', isColumnSortable: true },
    { label: 'Inte ifyllda', property: 'notFilledIn', isColumnSortable: true },
  ];

  const pupilHeaders = pupilHeaderLabels.map((h, idx) => {
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

  const pupilSearchFilter = (q: string, obj: KeyStringTable | Pupil) => {
    if (typeof obj.pupil === 'string' && obj.pupil?.toLowerCase().includes(q)) {
      return true; // pupil
    } else if (typeof obj.className === 'string' && obj.className?.toLowerCase().includes(q)) {
      return true; //class
    } else {
      return false;
    }
  };

  const pupilListSearchFiltered = allPupilsTable.filter(
    searchFilter(searchQuery ? searchQuery : '', pupilSearchFilter)
  );

  const pupilListRendered = pupilListSearchFiltered;

  //rows all pupils
  const pupilRows = pupilListRendered
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
          <Table.HeaderColumn scope="row">
            <div className="flex items-center gap-2">
              <Avatar
                imageUrl={`${(typeof p.image === 'string' && p.image?.length !== 0) || p.image ? p.image : ''}`}
                color="vattjom"
                rounded
                initials={initialsFunction(typeof p.pupil === 'string' && p.pupil ? p.pupil : '')}
                size="sm"
                accent
              />
              <span className="ml-8 font-bold">
                {p.totalSubjects !== 0 ? (
                  <Link href={`/klasser/klass/elev/${p.id}`}>{p.pupil}</Link>
                ) : (
                  <>{typeof p.pupil === 'string' && p.pupil} </>
                )}
              </span>
            </div>
          </Table.HeaderColumn>
          <Table.Column>
            <Link href={`/klasser/klass/${p.groupId}`}>{p.className}</Link>
          </Table.Column>
          <Table.Column>
            <div className="flex max-w-[300px] items-center gap-2">
              <span className="ml-8">
                {p.teachers &&
                  Array.isArray(p.teachers) &&
                  p.teachers.map((v, idx) => {
                    const fullName = `${v.givenname} ${v.lastname}`;
                    const nameArr = fullName.split('');
                    const initials = nameArr.filter(function (char) {
                      return /[A-Z]/.test(char);
                    });

                    const secondletterInLastName = v.lastname && v.lastname.split('').slice(1, 2);
                    const abbreviation = `${initials.join('')}${secondletterInLastName}`;
                    return v ? (
                      <span key={`teacher-${idx}`}>
                        {v?.givenname} {v?.lastname} ({abbreviation}){'  '}
                      </span>
                    ) : (
                      '-'
                    );
                  })}
              </span>
            </div>
          </Table.Column>
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
                    color={!p.approved ? 'tertiary' : 'gronsta'}
                    counter={!p.approved || typeof p.approved !== 'number' ? 0 : p.approved}
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
                    inverted={!p.warnings}
                    color={!p.warnings ? 'tertiary' : 'warning'}
                    counter={!p.warnings || typeof p.warnings !== 'number' ? 0 : p.warnings}
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
                    inverted={!p.unapproved}
                    color={!p.unapproved ? 'tertiary' : 'error'}
                    counter={!p.unapproved || typeof p.unapproved !== 'number' ? 0 : p.unapproved}
                  />
                )}
              </span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              {p.totalSubjects !== 0 ? (
                <span className="ml-8">
                  <Badge
                    rounded
                    inverted={!p.notFilledIn}
                    color="tertiary"
                    counter={!p.notFilledIn || typeof p.notFilledIn !== 'number' ? 0 : p.notFilledIn}
                  />
                </span>
              ) : (
                <span>Inga ämnen att fylla i</span>
              )}
            </div>
          </Table.Column>
        </Table.Row>
      );
    });

  const footer = (
    <Table.Footer className={pupilRows.length > 10 ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''}>
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
          Rader per sida:
        </label>
        <Input
          size="sm"
          id="pagePageSize"
          type="number"
          min={1}
          max={1000}
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
          pages={Math.ceil(pupilListRendered.length / _pageSize)}
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

  const pupilListTable = (
    <Table
      dense={rowHeight === 'dense'}
      background={true}
      className={`${pupilRows.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {pupilHeaders}
      </Table.Header>
      <Table.Body>{pupilRows}</Table.Body>
      {footer}
    </Table>
  );

  return { pupilListTable, allPupilsTable, allPupils, pupilListRendered };
};
