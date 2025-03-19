import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { Avatar, Badge, Link, Table, SortMode, Select, Pagination, Input } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';
import { KeyStringTable } from '@interfaces/forecast/forecast';
import { useUserStore } from '@services/user-service/user-service';
import { ISubjectsTable, SubjectsTableForm } from '../subjects-groups.component';

interface GroupHeaders {
  label?: string;
  property?: keyof ISubjectsTable;
  isColumnSortable: boolean;
}

//Table structure for group type tables
export const SubjectsTable: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const { headmaster, mentor, teacher } = hasRolePermission(user);
  const { mySubjects } = usePupilForecastStore();
  const [subjectsTable, setSubjectsTable] = useState<KeyStringTable[]>([]);
  //   const [pageSize] = useState<number>(myClasses.pageSize);

  const { watch, setValue, register, formState } = useFormContext<SubjectsTableForm>();
  const sortOrder = watch('sortOrder');
  const sortColumn = watch('sortColumn');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pageSize = watch('pageSize');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalPages = watch('totalPages');
  const page = watch('page');

  const TableSortOrder = sortOrder === 'ASC' ? SortMode.ASC : SortMode.DESC;

  useEffect(() => {
    const tableArr: KeyStringTable[] = [];

    if (mySubjects.data.length !== 0) {
      mySubjects.data.map((s) => {
        const numberNotFilledIn =
          (s?.totalPupils || 0) - (s?.approvedPupils || 0) - (s?.warningPupils || 0) - (s?.unapprovedPupils || 0);
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

    setSubjectsTable(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySubjects]);

  const [rowHeight, setRowHeight] = useState<string>('normal');

  const subjectsHeaderLabels: GroupHeaders[] = [
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

  const subjectsHeaders = subjectsHeaderLabels.map((h, idx) => {
    return (
      h.isColumnSortable && (
        <Table.HeaderColumn key={`headercol-${idx}`} aria-sort={sortColumn === h.property ? TableSortOrder : 'none'}>
          <Table.SortButton
            isActive={sortColumn === h.property}
            aria-description={sortColumn === h.property ? undefined : 'sortera'}
            sortOrder={TableSortOrder}
            onClick={() => setValue('sortColumn', h.property ? h.property : 'groupName')}
          >
            {h.label}
          </Table.SortButton>
        </Table.HeaderColumn>
      )
    );
  });

  //rows
  const groupRows = subjectsTable.map((g, idx: number) => {
    return (
      <Table.Row key={`row-${idx}`}>
        <Table.HeaderColumn scope="row">
          <div className="flex items-center gap-2">
            <Avatar
              // imageUrl=""
              color="vattjom"
              rounded
              initials={`${g.groupName && typeof g.groupName === 'string' && g.groupName.split('').slice(0, 2)}`}
              size="sm"
              accent
            />
            <span className="ml-8 font-bold">
              <Link
                href={`${headmaster ? `/amnen-grupper/amne-grupp/${g.id}` : `/mina-amnen-grupper/amne-grupp/${g.id}`}`}
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
                  Array.isArray(g.teachers) &&
                  g.teachers.map((t) => {
                    const fullName = `${t.givenname} ${t.lastname}`;
                    const nameArr = fullName.split('');
                    const initials = nameArr.filter(function (char) {
                      return /[A-Z]/.test(char);
                    });

                    const secondletterInLastName = t.lastname && t.lastname.split('').slice(1, 2);
                    const abbreviation = `${initials.join('')}${secondletterInLastName}`;
                    const lastObject = g.teachers && Array.isArray(g.teachers) && g.teachers[g.teachers.length - 1];
                    return t ? (
                      <span key={`teacher-${t.personId}`}>
                        {t?.givenname} {t?.lastname} ({abbreviation})`
                        {g.teachers &&
                          Array.isArray(g.teachers) &&
                          g.teachers.length > 1 &&
                          t.personId !== lastObject?.personId &&
                          ','}
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
          <span>{typeof g.totalPupils === 'number' && g.totalPupils}</span>
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
                  counter={!g.approvedPupils ? 0 : typeof g?.approvedPupils === 'number' ? g?.approvedPupils : 0}
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
                  counter={!g.warningPupils ? 0 : typeof g.warningPupils === 'number' ? g.warningPupils : 0}
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
                  counter={!g.unapprovedPupils ? 0 : typeof g.unapprovedPupils === 'number' ? g.unapprovedPupils : 0}
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
                counter={!g.notFilledIn ? 0 : typeof g.notFilledIn === 'number' ? g.notFilledIn : 0}
              />
            </span>
          </div>
        </Table.Column>
      </Table.Row>
    );
  });

  console.log(mySubjects.pageNumber);

  const footer = (
    <Table.Footer className={groupRows.length > 10 ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''}>
      <div className="sk-table-bottom-section">
        <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
          Rader per sida:
        </label>
        <Input
          autoFocus={formState.dirtyFields.pageSize}
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
          pages={mySubjects.totalPages}
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
        <Select id="pagiRowHeight" size="sm" value={rowHeight} onSelectValue={(value: string) => setRowHeight(value)}>
          <Select.Option value={'normal'}>Normal</Select.Option>
          <Select.Option value={'dense'}>Tät</Select.Option>
        </Select>
      </div>
    </Table.Footer>
  );

  return (
    <Table
      dense={rowHeight === 'dense'}
      background={true}
      className={`${groupRows.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {subjectsHeaders}
      </Table.Header>
      <Table.Body>{groupRows}</Table.Body>
      {footer}
    </Table>
  );
};
