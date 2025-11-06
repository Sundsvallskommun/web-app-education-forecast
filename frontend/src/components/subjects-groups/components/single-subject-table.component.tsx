import { User } from '@interfaces/user';
import { Avatar, Label, Link, Table, SortMode, Input, Pagination, Select } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';

import { ForecastMyGroupTeacher, Pupil } from '@interfaces/forecast/forecast';
import { initialsFunction } from '@utils/initials';
import { EditForecast } from '@components/edit-forecast/edit-forecast.component';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
interface TablePupil extends Pupil {
  id?: string | null;
  pupil?: string | null;
  className?: string | null;
  groupId?: string | null;
  classGroupId?: string | null;
  courseName?: string | null;
  courseId?: string | null;
  presence?: number | null;
  approved?: number | null;
  warnings?: number | null;
  forecast?: number | null;
  unapproved?: number | null;
  schoolYear?: number | null;
  teachers?: ForecastMyGroupTeacher[] | null;
  hasNotFilledIn?: number | null;
  notFilledIn?: number | null;
  image?: string | null;
  forecastPeriod?: string | null;
  syllabusId: string;
  groupName?: string | null;
}

interface TablePupilHeaders {
  label: string;
  property: keyof TablePupil;
  isColumnSortable: boolean;
}

interface ISingleSubjectTable {
  user: User;
  searchQuery?: string;
  selectedSyllabus: string;
}

export const SingleSubjectTable: React.FC<ISingleSubjectTable> = ({ user, searchQuery, selectedSyllabus }) => {
  const { headmaster, teacher } = hasRolePermission(user);
  const [pageSize] = useState<number>(60);
  const subject = usePupilForecastStore((s) => s.subject);
  const myClasses = usePupilForecastStore((s) => s.myClasses);
  const [pupilsInGroupData, setPupilsInGroupData] = useState<TablePupil[]>([]);

  useEffect(() => {
    const tableArr: TablePupil[] = [];

    if (subject.length !== 0) {
      subject.map((p) => {
        const numberNotFilledIn =
          (p?.totalSubjects || 0) - (p?.approved || 0) - (p?.warnings || 0) - (p?.unapproved || 0);
        tableArr.push({
          id: p.pupil,
          pupil: `${p.givenname} ${p.lastname}`,
          className: p.className,
          groupId: p.groupId,
          classGroupId: p.classGroupId,
          courseName: p.courseName,
          courseId: p.courseId,
          presence: p.presence,
          approved: p.approved,
          warnings: p.warnings,
          forecast: p.forecast,
          forecastPeriod: p.forecastPeriod,
          unapproved: p.unapproved,
          schoolYear: p.schoolYear,
          notFilledIn: numberNotFilledIn,
          teachers: p.teachers,
          syllabusId: selectedSyllabus,
          totalSubjects: null,
          hasNotFilledIn: p.forecast === null || p.forecast === undefined ? 1 : 0,
          image: p.image,
        });
      });
    }

    setPupilsInGroupData(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const [_pageSize, setPageSize] = useState<number>(pageSize);
  const [sortColumn, setSortColumn] = useState<keyof TablePupil>('pupil');
  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowHeight, setRowHeight] = useState<string>('normal');

  const handleSort = (column: keyof TablePupil) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const groupHeaderLabels: TablePupilHeaders[] = [
    { label: 'Elev', property: 'pupil', isColumnSortable: true },
    { label: 'Klass', property: 'className', isColumnSortable: true },
    { label: 'Närvaro i ämnet', property: 'presence', isColumnSortable: true },
    { label: 'Prognos', property: 'forecast', isColumnSortable: true },
  ];

  const groupHeaders = groupHeaderLabels.map((h, idx) => {
    return (
      <Table.HeaderColumn
        className="relative"
        key={`headercol-${idx}`}
        aria-sort={sortColumn === h.property ? sortOrder : 'none'}
      >
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

  const manyPupilsListSearchFiltered = pupilsInGroupData.filter((p) => {
    if (searchQuery && searchQuery !== '') {
      return (
        p?.pupil?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        p?.className?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
    } else return p;
  });

  const manyPupilsListRendered = manyPupilsListSearchFiltered;

  // rows subject with pupils
  const groupWithPupilsRows = manyPupilsListRendered
    .sort((a: TablePupil, b: TablePupil) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return `${a[sortColumn]}` < `${b[sortColumn]}` ? order : `${a[sortColumn]}` > `${b[sortColumn]}` ? order * -1 : 0;
    })
    .slice((currentPage - 1) * _pageSize, currentPage * _pageSize)
    .map((p, idx: number) => {
      return (
        <Table.Row
          key={`row-${idx}`}
          className={`
          [&_.sk-table-tbody-td]:hover:bg-transparent
          ${
            p.forecast === 1 && 'border-b-1 border-gray-300 bg-success-background-200 hover:bg-success-background-100'
          } ${
            p.forecast === 2 && 'border-b-1 border-gray-300 bg-warning-background-200 hover:bg-warning-background-100'
          } ${p.forecast === 3 && 'border-b-1 border-gray-300 bg-error-background-200 hover:bg-error-background-100'}`}
          data-cy={`single-subject-table-row-${idx}`}
        >
          <Table.HeaderColumn scope="row">
            <div className="flex items-center gap-2">
              <Avatar
                imageUrl={`${p.image}`}
                color="vattjom"
                rounded
                initials={initialsFunction(typeof p.pupil === 'string' && p.pupil ? p.pupil : '')}
                size="sm"
                accent
              />
              {headmaster && !teacher ? (
                <span className="ml-8 font-bold">
                  <Link href={`/klasser/klass/elev/${p.id}`}>{p.pupil}</Link>
                </span>
              ) : (
                <span className="ml-8 font-bold" data-cy={`single-subject-pupil`}>
                  {myClasses.data.find((x) => x.groupName === p.className) ? (
                    <Link href={`/min-mentorsklass/elev/${p.id}`}>{p.pupil}</Link>
                  ) : (
                    typeof p.pupil === 'string' && p?.pupil
                  )}
                </span>
              )}
            </div>
          </Table.HeaderColumn>
          <Table.Column>
            {headmaster ? (
              <Link href={`/klasser/klass/${p.classGroupId}`}>{p.className}</Link>
            ) : (
              <span>
                {myClasses.data.find((x) => x.groupName === p.className) ? (
                  <Link href={`/min-mentorsklass/${p.classGroupId}`}>{p.className}</Link>
                ) : (
                  typeof p?.className === 'string' && p?.className
                )}
              </span>
            )}
          </Table.Column>
          <Table.Column>
            <div className="flex items-center gap-2">
              <span className="ml-8">{!p.presence ? '-' : `${p.presence}%`}</span>
            </div>
          </Table.Column>
          <Table.Column>
            {headmaster && !teacher ? (
              <div className="flex items-center gap-2">
                <>
                  {p.forecast === 1 && (
                    <Label rounded color="gronsta">
                      Når målen
                    </Label>
                  )}
                  {p.forecast === 2 && (
                    <Label rounded color="warning">
                      Uppmärksammad
                    </Label>
                  )}
                  {p.forecast === 3 && (
                    <Label rounded color="error">
                      Når ej målen
                    </Label>
                  )}
                  {!p.forecast && (
                    <Label rounded color="black">
                      Inte ifylld
                    </Label>
                  )}
                </>
              </div>
            ) : (
              <EditForecast
                pupil={
                  p && {
                    syllabusId: p.syllabusId && typeof p.syllabusId === 'string' ? p.syllabusId : '',
                    pupilId: p.id && typeof p.id === 'string' ? p.id : '',
                    groupId: p.groupId && typeof p.groupId === 'string' ? p.groupId : '',
                  }
                }
                forecast={p.forecast === null || typeof p.forecast !== 'number' ? null : p.forecast}
              />
            )}
          </Table.Column>
        </Table.Row>
      );
    });

  const rowdata = groupWithPupilsRows;
  const footer = (
    <Table.Footer className={rowdata.length > 10 ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''}>
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
          pages={Math.ceil(manyPupilsListRendered.length / _pageSize)}
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
      dense={rowHeight === 'dense'}
      background={true}
      className={`${rowdata.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-48'}`}
      data-cy="single-subject-table"
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {groupHeaders}
      </Table.Header>
      <Table.Body>{groupWithPupilsRows}</Table.Body>
      {footer}
    </Table>
  );
};
