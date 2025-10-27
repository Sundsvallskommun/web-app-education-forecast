import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { Avatar, Badge, Link, Table, SortMode, Select, Pagination, Input } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { useUserStore } from '@services/user-service/user-service';
import { ISubjectsTable, SubjectsTableForm } from '../subjects-groups.component';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';

interface GroupHeaders {
  label?: string;
  property?: keyof ISubjectsTable;
  isColumnSortable: boolean;
  isColumnVisible: boolean;
}

interface ISubjects {
  id?: string | null;
  groupName?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
  totalPupils?: number | null;
  presence?: number | null;
  approvedPupils?: number | null;
  warningPupils?: number | null;
  unapprovedPupils?: number | null;
  syllabusId?: string | null;
  notFilledIn?: number;
}

//Table structure for group type tables
export const SubjectsTable: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { headmaster, mentor, teacher } = hasRolePermission(user);
  const { mySubjects } = usePupilForecastStore();
  const [subjectsTable, setSubjectsTable] = useState<ISubjects[]>([]);
  const selectedSchool = useUserStore((state) => state.selectedSchool, shallow);
  const { watch, setValue, register, formState } = useFormContext<SubjectsTableForm>();
  const sortOrder = watch('sortOrder');
  const sortColumn = watch('sortColumn');
  const page = watch('page');

  const TableSortOrder = sortOrder === 'ASC' ? SortMode.ASC : SortMode.DESC;

  useEffect(() => {
    const tableArr: ISubjects[] = [];

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
          syllabusId: s.syllabusId,
          notFilledIn: numberNotFilledIn,
        });
      });
    }

    setSubjectsTable(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySubjects]);

  const [rowHeight, setRowHeight] = useState<string>('normal');

  const subjectsHeaderLabels: GroupHeaders[] = [
    { label: 'Grupp', property: 'groupName', isColumnSortable: true, isColumnVisible: true },
    !mentor && !teacher
      ? { label: 'Lärare', property: 'teachers', isColumnSortable: true, isColumnVisible: true }
      : { isColumnSortable: false, isColumnVisible: false },
    { label: 'Antal elever', property: 'totalPupils', isColumnSortable: true, isColumnVisible: true },
    { label: 'Närvaro', property: 'presence', isColumnSortable: true, isColumnVisible: true },
    { label: 'Når målen', property: 'approvedPupils', isColumnSortable: true, isColumnVisible: true },
    { label: 'Uppmärksammad', property: 'warningPupils', isColumnSortable: true, isColumnVisible: true },
    { label: 'Når ej målen', property: 'unapprovedPupils', isColumnSortable: true, isColumnVisible: true },
    { label: 'Inte ifyllda', property: 'notFilledIn', isColumnSortable: false, isColumnVisible: true },
  ];

  const handleSort = (h: GroupHeaders) => {
    setValue('sortOrder', sortOrder === 'DESC' ? 'ASC' : 'DESC');

    setValue('sortColumn', h.property ? h.property.charAt(0).toUpperCase() + h.property.slice(1) : 'GroupName');
  };

  const subjectsHeaders = subjectsHeaderLabels.map((h, idx) => {
    return (
      h.isColumnVisible && (
        <Table.HeaderColumn key={`headercol-${idx}`} aria-sort={sortColumn === h.property ? TableSortOrder : 'none'}>
          {h.isColumnSortable ? (
            <Table.SortButton
              isActive={sortColumn === h.property}
              aria-description={sortColumn === h.property ? undefined : 'sortera'}
              sortOrder={TableSortOrder}
              onClick={() => handleSort(h)}
            >
              {h.label}
            </Table.SortButton>
          ) : (
            <span>{h.label}</span>
          )}
        </Table.HeaderColumn>
      )
    );
  });

  const getLink = (group: ISubjects) => {
    switch (!!headmaster) {
      case true:
        return `/amnen-grupper/amne-grupp/${group.id}-syllabus-${group.syllabusId}/`;
      default:
        return `/mina-amnen-grupper/${selectedSchool.schoolId}/amne-grupp/${group.id}-syllabus-${group.syllabusId}`;
    }
  };

  //rows
  const groupRows = subjectsTable.map((group, idx: number) => {
    return (
      <Table.Row key={`row-${idx}`}>
        <Table.HeaderColumn scope="row">
          <div className="flex items-center gap-2">
            <Avatar
              color="vattjom"
              rounded
              initials={`${group.groupName && typeof group.groupName === 'string' && group.groupName.split('').slice(0, 2)}`}
              size="sm"
              accent
            />
            <span className="ml-8 font-bold cursor-pointer">
              <Link onClick={() => router.push(getLink(group))}>{group.groupName}</Link>
            </span>
          </div>
        </Table.HeaderColumn>
        {!mentor && !teacher ? (
          <Table.Column>
            <div className="flex max-w-[300px] items-center gap-2">
              <span className="ml-8">
                {group.teachers && group.teachers.length > 0 ? (
                  Array.isArray(group.teachers) &&
                  group.teachers.map((t) => {
                    const fullName = `${t.givenname} ${t.lastname}`;
                    const nameArr = fullName.split('');
                    const initials = nameArr.filter(function (char) {
                      return /[A-Z]/.test(char);
                    });

                    const secondletterInLastName = t.lastname && t.lastname.split('').slice(1, 2);
                    const abbreviation = `${initials.join('')}${secondletterInLastName}`;
                    return t ? (
                      <span key={`teacher-${t.personId}`}>
                        {t?.givenname} {t?.lastname} ({abbreviation})`
                        {group.teachers &&
                          Array.isArray(group.teachers) &&
                          group.teachers.length > 1 &&
                          t.personId !== group.teachers[group.teachers.length - 1].personId &&
                          ','}
                        {'  '}
                      </span>
                    ) : (
                      '-'
                    );
                  })
                ) : (
                  <span> - </span>
                )}
              </span>
            </div>
          </Table.Column>
        ) : (
          <></>
        )}
        <Table.Column>
          <span>{typeof group.totalPupils === 'number' && group.totalPupils}</span>
        </Table.Column>
        <Table.Column>
          <div className="flex items-center gap-2">
            <span className="ml-8">{!group.presence ? '-' : `${group.presence}%`}</span>
          </div>
        </Table.Column>
        <Table.Column>
          <div className="flex items-center gap-2">
            <span className="ml-8">
              {group.totalPupils === group.notFilledIn ? (
                '-'
              ) : (
                <Badge
                  inverted
                  rounded
                  color={!group.approvedPupils ? 'tertiary' : 'gronsta'}
                  counter={
                    !group.approvedPupils ? 0 : typeof group?.approvedPupils === 'number' ? group?.approvedPupils : 0
                  }
                />
              )}
            </span>
          </div>
        </Table.Column>
        <Table.Column>
          <div className="flex items-center gap-2">
            <span className="ml-8">
              {group.totalPupils === group.notFilledIn ? (
                '-'
              ) : (
                <Badge
                  rounded
                  inverted={!group.warningPupils}
                  color={!group.warningPupils ? 'tertiary' : 'warning'}
                  counter={!group.warningPupils ? 0 : typeof group.warningPupils === 'number' ? group.warningPupils : 0}
                />
              )}
            </span>
          </div>
        </Table.Column>
        <Table.Column>
          <div className="flex items-center gap-2">
            <span className="ml-8">
              {group.totalPupils === group.notFilledIn ? (
                '-'
              ) : (
                <Badge
                  rounded
                  inverted={!group.unapprovedPupils}
                  color={!group.unapprovedPupils ? 'tertiary' : 'error'}
                  counter={
                    !group.unapprovedPupils
                      ? 0
                      : typeof group.unapprovedPupils === 'number'
                        ? group.unapprovedPupils
                        : 0
                  }
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
                inverted={!group.notFilledIn}
                color="tertiary"
                counter={!group.notFilledIn ? 0 : typeof group.notFilledIn === 'number' ? group.notFilledIn : 0}
              />
            </span>
          </div>
        </Table.Column>
      </Table.Row>
    );
  });

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
