import { User } from '@interfaces/user';
import { Avatar, Button, Icon, Label, Link, Table, SortMode, Input, Pagination, Select } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { ForecastMyGroupTeacher, Pupil } from '@interfaces/forecast/forecast';
import dayjs from 'dayjs';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
export interface TablePupil extends Pupil {
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
  groupName?: string | null;
}

interface TablePupilHeaders {
  label: string;
  property: keyof TablePupil;
  isColumnSortable: boolean;
}
interface ISinglePupilTable {
  user: User;
  searchQuery: string;
}

export const SinglePupilTable: React.FC<ISinglePupilTable> = ({ user, searchQuery }) => {
  const router = useRouter();
  const { headmaster } = hasRolePermission(user);
  const [pageSize] = useState<number>(10);
  const pupil = usePupilForecastStore((s) => s.pupil);
  const [summerPeriod, setSummerPeriod] = useState<boolean>(false);
  const [pupilTable, setPupilTable] = useState<TablePupil[]>([]);

  useEffect(() => {
    const pupilArr: TablePupil[] = [];
    if (pupil && pupil.length > 0) {
      pupil.map((p) => {
        pupilArr.push(p);
      });
    }

    setPupilTable(pupilArr);
  }, [pupil]);

  useEffect(() => {
    if (
      dayjs(new Date()).month() >= dayjs(new Date(new Date().getFullYear(), 5, 1)).month() &&
      dayjs(new Date()).month() < dayjs(new Date(new Date().getFullYear(), 7, 1)).month()
    ) {
      setSummerPeriod(true);
    } else {
      setSummerPeriod(false);
    }
  }, []);

  const [_pageSize, setPageSize] = useState<number>(pageSize);
  const [sortColumn, setSortColumn] = useState<keyof TablePupil>('courseName');
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

  const pupilHeaderLabels: TablePupilHeaders[] = [
    { label: 'Ämne', property: 'courseName', isColumnSortable: true },
    { label: 'Lärare', property: 'teachers', isColumnSortable: true },
    { label: 'Närvaro i ämnet', property: 'presence', isColumnSortable: true },
    { label: 'Prognos', property: 'forecast', isColumnSortable: true },
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

  const singlePupilListSearchFiltered = pupilTable.filter((p) => {
    if (searchQuery && searchQuery !== '') {
      return p?.courseName?.toLowerCase().includes(searchQuery?.toLowerCase());
    } else return p;
  });

  const singlepPupilListRendered = singlePupilListSearchFiltered;

  // rows single pupil
  const pupilRows = singlepPupilListRendered
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
        >
          <Table.HeaderColumn scope="row">
            <div className="flex items-center gap-2">
              <Avatar
                color="vattjom"
                rounded
                initials={`${p.courseName && typeof p.courseName === 'string' && p.courseName.split('').slice(0, 2).toString().replace(',', '')}`}
                size="sm"
                accent
              />
              <span className="ml-8 font-bold">
                {(Array.isArray(p.teachers) && p.teachers?.find((x) => x.personId === user.personId)) || headmaster ? (
                  <Link
                    className="cursor-pointer"
                    onClick={() => router.push(`/amnen-grupper/amne-grupp/${p.groupId}-syllabus-${p.syllabusId}`)}
                  >
                    {p.courseName}
                  </Link>
                ) : (
                  <>{typeof p.courseName === 'string' && p.courseName}</>
                )}
              </span>
            </div>
          </Table.HeaderColumn>
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
          <Table.Column
            colSpan={Array.isArray(p.teachers) && !p.teachers?.find((x) => x.personId === user.personId) ? 2 : 1}
          >
            <div className="flex justify-between">
              {summerPeriod ? (
                <Label inverted rounded color="juniskar">
                  Inga prognoser under sommaren
                </Label>
              ) : (
                <div className="flex items-center gap-2">
                  {p.forecast === 1 && (
                    <Label rounded color="gronsta">
                      Når målen
                    </Label>
                  )}
                  {p.forecast === 2 && (
                    <Label rounded color="warning">
                      Varning
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
                </div>
              )}
            </div>
          </Table.Column>

          {!headmaster && Array.isArray(p.teachers) && p.teachers?.find((x) => x.personId === user.personId) ? (
            <Table.Column>
              <div className="flex items-center gap-2">
                <Button
                  className="float-right"
                  color="vattjom"
                  size="sm"
                  inverted
                  rightIcon={<Icon name="arrow-right" />}
                  onClick={() => router.push(`/mina-amnen-grupper/amne-grupp/${p.groupId}-syllabus-${p.syllabusId}`)}
                >
                  Rapportera
                </Button>
              </div>
            </Table.Column>
          ) : (
            <></>
          )}
        </Table.Row>
      );
    });

  const rowdata = pupilRows;
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
          pages={Math.ceil(singlepPupilListRendered.length / _pageSize)}
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
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {pupilHeaders}
      </Table.Header>
      <Table.Body>{pupilRows}</Table.Body>
      {footer}
    </Table>
  );
};
