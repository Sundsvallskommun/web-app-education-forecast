import { MyGroup } from '@interfaces/forecast/forecast';
import { User } from '@interfaces/user';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { Avatar, Badge, Link, Table, SortMode, Select, Pagination, Input } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { searchFilter } from '@utils/search';
import { useEffect, useState } from 'react';
//import { IsGradedForecast } from '@utils/is-grade-forecast';

//Table structure for group type tables
export const GroupTables = (groupType, user: User, searchQuery?: string) => {
  const { headmaster, mentor, teacher } = hasRolePermission(user);
  const { myClasses, mySubjects } = useForecastStore();
  const [grouptable, setGrouptable] = useState([]);
  const [pageSize] = useState<number>(10);
  // const {APPROVED, WARNINGS, UNNAPROVED, NOTFILLEDIN} = IsGradedForecast(groupType === "K" ? myClasses : mySubjects, Array);
  useEffect(() => {
    const tableArr = [];
    if (groupType === 'K') {
      if (myClasses.length !== 0) {
        myClasses.map((c) => {
          const numberNotFilledIn = c.totalPupils - c.approvedPupils - c.warningPupils - c.unapprovedPupils;
          tableArr.push({
            id: c.groupId,
            groupName: `Klass ${c.groupName}`,
            teachers: c.teachers,
            totalPupils: c.totalPupils,
            presence: c.presence,
            approvedPupils: c.approvedPupils,
            warningPupils: c.warningPupils,
            unapprovedPupils: c.unapprovedPupils,
            notFilledIn: numberNotFilledIn,
          });
        });
      }
    } else if (groupType === 'G') {
      if (mySubjects.length !== 0) {
        mySubjects.map((s) => {
          const numberNotFilledIn = s.totalPupils - s.approvedPupils - s.warningPupils - s.unapprovedPupils;
          tableArr.push({
            id: s.groupId,
            groupName: s.groupName,
            teachers: s.teachers,
            totalPupils: s.totalPupils,
            presence: s.presence,
            approvedPupils: s.approvedPupils,
            warningPupils: s.warningPupils,
            unapprovedPupils: s.unapprovedPupils,
            notFilledIn: numberNotFilledIn,
          });
        });
      }
    }

    setGrouptable(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupType === 'K' ? myClasses : mySubjects]);

  const [_pageSize, setPageSize] = useState<number>(pageSize);
  const [sortColumn, setSortColumn] = useState<string>('groupName');
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

  const subjectsHeaderLabels = [
    { label: 'Grupp', property: 'groupName', isColumnSortable: true },
    !mentor && !teacher
      ? { label: 'Lärare', property: 'teachers', isColumnSortable: true }
      : { isColumnSortable: false },
    { label: 'Antal elever', property: 'totalPupils', isColumnSortable: true },
    { label: 'Närvaro', property: 'presence', isColumnSortable: true },
    { label: 'Når målen', property: 'approvedPupils', isColumnSortable: true },
    { label: 'Varning', property: 'warningPupils', isColumnSortable: true },
    { label: 'Når ej målen', property: 'unapprovedPupils', isColumnSortable: true },
    { label: 'Inte ifyllda', property: 'notFilledIn', isColumnSortable: true },
  ];

  const classesHeaderLabels = [
    { label: 'Namn', property: 'pupil', isColumnSortable: true },
    { label: 'Mentor', property: 'teachers', isColumnSortable: true },
    { label: 'Antal elever', property: 'totalPupils', isColumnSortable: true },
    { label: 'Närvaro', property: 'presence', isColumnSortable: true },
    { label: 'Når målen', property: 'approved', isColumnSortable: true },
    { label: 'Varning', property: 'warning', isColumnSortable: true },
    { label: 'Når ej målen', property: 'unapproved', isColumnSortable: true },
    { label: 'Inte ifyllda', property: 'notFilledIn', isColumnSortable: true },
  ];

  const subjectsHeaders = subjectsHeaderLabels.map((h, idx) => {
    return (
      h.isColumnSortable && (
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
      )
    );
  });

  const classesHeaders = classesHeaderLabels.map((h, idx) => {
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

  const groupSearchFilter = (q: string, obj: MyGroup) => {
    if (obj.groupName.toLowerCase().includes(q)) {
      return true; // Titel
    } else {
      return false;
    }
  };

  const GroupsListSearchFiltered = grouptable.filter(searchFilter(searchQuery, groupSearchFilter));

  const groupsListRendered = GroupsListSearchFiltered;

  //rows
  const groupRows = groupsListRendered
    .sort((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return a[sortColumn] < b[sortColumn] ? order : a[sortColumn] > b[sortColumn] ? order * -1 : 0;
    })
    .slice((currentPage - 1) * _pageSize, currentPage * _pageSize)
    .map((g, idx: number) => {
      return (
        <Table.Row key={`row-${idx}`}>
          <Table.HeaderColumn scope="row">
            <div className="flex items-center gap-2">
              <Avatar
                // imageUrl=""
                color="vattjom"
                rounded
                initials={g.groupName.split('').slice(0, 2)}
                size="sm"
                accent
              />
              <span className="ml-8 font-bold">
                <Link
                  href={
                    groupType === 'K'
                      ? `/klasser/klass/${g.id}`
                      : `${headmaster ? `/amnen-grupper/amne-grupp/${g.id}` : `/mina-amnen-grupper/amne-grupp/${g.id}`}`
                  }
                >
                  {g.groupName}
                </Link>
              </span>
            </div>
          </Table.HeaderColumn>
          {!mentor && !teacher ? (
            <Table.Column>
              <div className="flex max-w-[300px] items-center gap-2">
                <span className="ml-8">
                  {g.teachers &&
                    g.teachers.map((t) => {
                      const fullName = `${t.givenname} ${t.lastname}`;
                      const nameArr = fullName.split('');
                      const initials = nameArr.filter(function (char) {
                        return /[A-Z]/.test(char);
                      });

                      const secondletterInLastName = t.lastname.split('').slice(1, 2);
                      const abbreviation = `${initials.join('')}${secondletterInLastName}`;
                      const lastObject = g.teachers[g.teachers.length - 1];
                      return t ? (
                        <span key={`teacher-${t.personId}`}>
                          {groupType === 'K' ? (
                            <Link
                              title={`${t?.givenname} ${t?.lastname}`}
                              href={`mailto:${t?.email}`}
                            >{t?.email}</Link>
                          ) : (
                            `${t?.givenname} ${t?.lastname} (${abbreviation})`
                          )}
                          {g.teachers.length > 1 && t.personId !== lastObject.personId && ','}
                          {'  '}
                        </span>
                      ) : (
                        '-'
                      );
                    })}
                </span>
              </div>
            </Table.Column>
          ) : (
            <></>
          )}
          <Table.Column>
            <span>{g.totalPupils}</span>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">{!g.presence ? '-' : `${g.presence}%`}</span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                {g.totalPupils === g.notFilledIn ? (
                  '-'
                ) : (
                  <Badge
                    inverted
                    rounded
                    color={!g.approvedPupils ? 'tertiary' : 'gronsta'}
                    counter={!g.approvedPupils ? 0 : g.approvedPupils}
                  />
                )}
              </span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                {g.totalPupils === g.notFilledIn ? (
                  '-'
                ) : (
                  <Badge
                    rounded
                    inverted={!g.warningPupils}
                    color={!g.warningPupils ? 'tertiary' : 'warning'}
                    counter={!g.warningPupils ? 0 : g.warningPupils}
                  />
                )}
              </span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                {g.totalPupils === g.notFilledIn ? (
                  '-'
                ) : (
                  <Badge
                    rounded
                    inverted={!g.unapprovedPupils}
                    color={!g.unapprovedPupils ? 'tertiary' : 'error'}
                    counter={!g.unapprovedPupils ? 0 : g.unapprovedPupils}
                  />
                )}
              </span>
            </div>
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">
                <Badge
                  rounded
                  inverted={!g.notFilledIn}
                  color="tertiary"
                  counter={!g.notFilledIn ? 0 : g.notFilledIn}
                />
              </span>
            </div>
          </Table.Column>
        </Table.Row>
      );
    });

  const footer = (
    <Table.Footer className={groupRows.length > 10 && 'border-0 outline outline-1 outline-gray-300 rounded-b-18'}>
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
          pages={Math.ceil(groupsListRendered.length / _pageSize)}
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

  const grouplistTable = (
    <Table
      dense={rowHeight === 'dense'}
      background={true}
      className={`${groupRows.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {groupType === 'G' ? subjectsHeaders : classesHeaders}
      </Table.Header>
      <Table.Body>{groupRows}</Table.Body>
      {footer}
    </Table>
  );

  return { grouplistTable, grouptable, groupsListRendered, myClasses, mySubjects, pageSize };
};
