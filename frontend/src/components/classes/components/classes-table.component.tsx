import { Skeleton } from '@components/skeleton/skeleton.component';
import { TableFooter } from '@components/table/footer/table-footer.component';
import { SkeletonTableColumns } from '@components/table/skeleton/skeleton-table-rows.component';
import { ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { Avatar, Badge, Link, SortMode, Table } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ClassesTableForm, IClassesTable } from '../classes.component';

interface GroupHeaders {
  label?: string;
  property?: keyof IClassesTable;
  isColumnSortable: boolean;
}

interface IClasses {
  id?: string | null;
  groupName?: string | null;
  teachers?: ForecastMyGroupTeacher[] | null;
  totalPupils?: number | null;
  presence?: number | null;
  approvedPupils?: number | null;
  warningPupils?: number | null;
  unapprovedPupils?: number | null;
  notFilledIn?: number;
}

//Table structure for group type tables
export const ClassesTable: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { mentor, teacher } = hasRolePermission(user);
  const myClasses = usePupilForecastStore((s) => s.myClasses);
  const [classTable, setClassTable] = useState<IClasses[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { watch, setValue } = useFormContext<ClassesTableForm>();
  const sortOrder = watch('sortOrder');
  const sortColumn = watch('sortColumn');
  const pageSize = watch('pageSize');

  const TableSortOrder = sortOrder === 'ASC' ? SortMode.ASC : SortMode.DESC;

  useEffect(() => {
    const tableArr: IClasses[] = [];

    if (myClasses.data.length !== 0) {
      myClasses.data.map((c) => {
        const numberNotFilledIn =
          (c?.totalPupils || 0) - (c?.approvedPupils || 0) - (c?.warningPupils || 0) - (c?.unapprovedPupils || 0);
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

    setClassTable(tableArr);
    setLoaded(true);
  }, [myClasses]);

  const [rowHeight, setRowHeight] = useState<string>('normal');

  const classesHeaderLabels: GroupHeaders[] = [
    { label: 'Klass', property: 'groupName', isColumnSortable: true },
    { label: 'Mentor', property: 'teachers', isColumnSortable: true },
    { label: 'Antal elever', property: 'totalPupils', isColumnSortable: true },
    { label: 'Närvaro', property: 'presence', isColumnSortable: true },
    { label: 'Når målen', property: 'approvedPupils', isColumnSortable: true },
    { label: 'Uppmärksammad', property: 'warningPupils', isColumnSortable: true },
    { label: 'Når ej målen', property: 'unapprovedPupils', isColumnSortable: true },
    { label: 'Inte ifyllda', property: 'notFilledIn', isColumnSortable: false },
  ];

  const handleSort = (h: GroupHeaders) => {
    setValue('sortOrder', sortOrder === 'DESC' ? 'ASC' : 'DESC');

    setValue('sortColumn', h.property ? h.property.charAt(0).toUpperCase() + h.property.slice(1) : 'GroupName');
  };

  const classesHeaders = classesHeaderLabels.map((h, idx) => {
    return (
      <Table.HeaderColumn key={`headercol-${idx}`} aria-sort={sortColumn === h.property ? TableSortOrder : 'none'}>
        {h.isColumnSortable ? (
          <Table.SortButton
            disabled={!loaded}
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
    );
  });

  const loadingCols = [
    {
      element: (
        <div className="flex items-center gap-2">
          <Skeleton className="w-32 h-32 !rounded-full">-</Skeleton>
          <Skeleton className="h-24 w-60">Laddar</Skeleton>
        </div>
      ),
    },
    {
      element: (
        <div className="flex flex-col max-w-[300px] items-start gap-2">
          <Skeleton className="h-18 w-[24rem]">-</Skeleton>
          <Skeleton className="h-18 w-[16rem]">-</Skeleton>
        </div>
      ),
    },
    { minSize: 16, height: 1.8 },
    { element: <Skeleton className="h-24 w-24 !rounded-full">0</Skeleton> },
    { element: <Skeleton className="h-24 w-24 !rounded-full">0</Skeleton> },
    { element: <Skeleton className="h-24 w-24 !rounded-full">0</Skeleton> },
    { element: <Skeleton className="h-24 w-24 !rounded-full">0</Skeleton> },
    { element: <Skeleton className="h-24 w-24 !rounded-full">0</Skeleton> },
  ];

  //rows
  const groupRows = classTable.map((g, idx: number) => {
    return (
      <Table.Row key={`row-${idx}`}>
        <Table.HeaderColumn scope="row">
          <div className="flex items-center gap-2">
            <Avatar
              color="vattjom"
              rounded
              initials={`${g.groupName && typeof g.groupName === 'string' && g.groupName.split('').slice(0, 2)}`}
              size="sm"
              accent
            />
            <span className="ml-8 font-bold cursor-pointer">
              <Link onClick={() => router.push(`/klasser/klass/${g.id}`)} data-cy={`class-link-${g.id}`}>
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

                    return t ? (
                      <span key={`teacher-${t.personId}`}>
                        {t?.givenname} {t?.lastname} ({abbreviation})
                        {g.teachers &&
                          Array.isArray(g.teachers) &&
                          g.teachers.length > 1 &&
                          t.personId !== g.teachers[g.teachers.length - 1].personId &&
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
                  data-cy={`approved-pupils-badge-${g.id}`}
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

  return loaded && myClasses.data.length < 1 ? (
    <p>Inga sökresultat att visa</p>
  ) : (
    <Table
      dense={rowHeight === 'dense'}
      background={true}
      className={`${groupRows.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-28'}`}
      data-cy="classes-table"
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body" data-cy="classes-table-header">
        {classesHeaders}
      </Table.Header>
      <Table.Body>{loaded ? groupRows : <SkeletonTableColumns rows={10} cols={loadingCols} />}</Table.Body>
      <Table.Footer className={groupRows.length > 10 ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''}>
        <TableFooter
          loaded={loaded}
          pageSize={pageSize}
          onChangePageSize={(value) => setValue('pageSize', value)}
          pages={myClasses.totalPages}
          activePage={myClasses.pageNumber}
          onChangePage={(page) => {
            setValue('page', page === 1 ? 1 : page);
          }}
          rowHeight={rowHeight}
          onChangeRowHeight={setRowHeight}
        />
      </Table.Footer>
    </Table>
  );
};
