import { ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { useUserStore } from '@services/user-service/user-service';
import { SortMode, Table } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ISubjectsTable, SubjectsTableForm } from '../../subjects-groups.component';
import { SubjectsTableFooter } from './components/subjects-table-footer.component';
import { SubjectsTableRows } from './components/subjects-table-rows.component';

interface GroupHeaders {
  label?: string;
  property?: keyof ISubjectsTable;
  isColumnSortable: boolean;
  isColumnVisible: boolean;
}

export interface ISubjects {
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
  const user = useUserStore((s) => s.user);
  const { mentor, teacher } = hasRolePermission(user);
  const { mySubjects } = usePupilForecastStore();
  const [subjectsTable, setSubjectsTable] = useState<ISubjects[]>([]);
  const { watch, setValue } = useFormContext<SubjectsTableForm>();
  const sortOrder = watch('sortOrder');
  const sortColumn = watch('sortColumn');

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

  const [rowHeight, setRowHeight] = useState<'normal' | 'dense'>('normal');

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

  const subjectsHeaders = subjectsHeaderLabels.map((header, index) => {
    return (
      header.isColumnVisible && (
        <Table.HeaderColumn
          key={`headercol-${index}-${header.property}`}
          aria-sort={sortColumn === header.property ? TableSortOrder : 'none'}
        >
          {header.isColumnSortable ? (
            <Table.SortButton
              isActive={sortColumn === header.property}
              aria-description={sortColumn === header.property ? undefined : 'sortera'}
              sortOrder={TableSortOrder}
              onClick={() => handleSort(header)}
            >
              {header.label}
            </Table.SortButton>
          ) : (
            <span>{header.label}</span>
          )}
        </Table.HeaderColumn>
      )
    );
  });

  //rows

  return (
    <Table
      dense={rowHeight === 'dense'}
      background={true}
      className={`${subjectsTable.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {subjectsHeaders}
      </Table.Header>
      <Table.Body>
        <SubjectsTableRows subjects={subjectsTable} />
      </Table.Body>
      <Table.Footer
        className={subjectsTable.length > 10 ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''}
      >
        <SubjectsTableFooter rowHeight={rowHeight} setRowHeight={setRowHeight} pages={mySubjects.totalPages} />
      </Table.Footer>
    </Table>
  );
};
