import { User } from '@interfaces/user';
import { useForecastStore } from '@services/forecast-service/forecats-service';
import { Avatar, Button, Icon, Label, Link, Table, SortMode, Input, Pagination, Select } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';

import router from 'next/router';
import { ForecastMyGroupTeacher, Pupil, KeyStringTable } from '@interfaces/forecast/forecast';
import { searchFilter } from '@utils/search';
import { initialsFunction } from '@utils/initials';
import { EditForecast } from '@components/edit-forecast/edit-forecast.component';
import dayjs from 'dayjs';
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
  groupName?: string | null;
}

interface TablePupilHeaders {
  label: string;
  property: keyof TablePupil;
  isColumnSortable: boolean;
}

export const CustomPupilTable = (user: User, isSinglePupil?: boolean, searchQuery?: string) => {
  const { headmaster } = hasRolePermission(user);
  const [pageSize] = useState<number>(isSinglePupil ? 10 : 60);
  const mentorClass = useForecastStore((s) => s.mentorClass);
  const groupWithPupils = useForecastStore((s) => s.groupWithPupils);
  const pupil = useForecastStore((s) => s.pupil);
  const myClasses = useForecastStore((s) => s.myClasses);
  const singlePupilIsLoading = useForecastStore((s) => s.singlePupilIsLoading);
  const groupWithPupilsIsLoading = useForecastStore((s) => s.groupWithPupilsIsLoading);
  const selectedPeriod = useForecastStore((s) => s.selectedPeriod);
  const selectedSchoolYear = useForecastStore((s) => s.selectedSchoolYear);
  const [pupilsInGroupData, setPupilsInGroupData] = useState<KeyStringTable[]>([]);
  const [summerPeriod, setSummerPeriod] = useState<boolean>(false);

  useEffect(() => {
    const tableArr: KeyStringTable[] = [];
    if (isSinglePupil) {
      if (pupil.length !== 0) {
        pupil.map((p) => {
          tableArr.push({
            id: p.pupil,
            pupil: `${p.givenname} ${p.lastname}`,
            className: p.className,
            groupId: p.groupId,
            courseName: p.courseName,
            courseId: p.courseId,
            presence: p.presence,
            approved: p.approved,
            warnings: p.warnings,
            forecast: p.forecast,
            unapproved: p.unapproved,
            schoolYear: p.schoolYear,
            teachers: p.teachers,
            hasNotFilledIn: p.forecast !== null ? 0 : 1,
          });
        });
      }
    } else {
      if (groupWithPupils.length !== 0) {
        groupWithPupils.map((p) => {
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
            hasNotFilledIn: p.forecast === null || p.forecast === undefined ? 1 : 0,
            image: p.image,
          });
        });
      }
    }

    setPupilsInGroupData(tableArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorClass, groupWithPupils, pupil]);

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
  const [sortColumn, setSortColumn] = useState<keyof TablePupil>(isSinglePupil ? 'courseName' : 'pupil');
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

  const groupHeaderLabels: TablePupilHeaders[] = [
    { label: 'Elev', property: 'pupil', isColumnSortable: true },
    { label: 'Klass', property: 'className', isColumnSortable: true },
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

  const singlePupilSearchFilter = (q: string, obj: KeyStringTable | Pupil) => {
    if (obj?.courseName == '' && obj?.courseName?.toLowerCase().includes(q)) {
      return true; // subject/group
    } else {
      return false;
    }
  };

  const manyPupilSearchFilter = (q: string, obj: KeyStringTable | Pupil) => {
    if (obj.pupil == '' && obj.pupil?.toLowerCase().includes(q)) {
      return true; // pupil
    } else if (obj.className == '' && obj.className?.toLowerCase().includes(q)) {
      return true; //class
    } else {
      return false;
    }
  };

  const singlePupilListSearchFiltered = pupil.filter(
    searchFilter(searchQuery ? searchQuery : '', singlePupilSearchFilter)
  );

  const singlepPupilListRendered = singlePupilListSearchFiltered;

  const manyPupilsListSearchFiltered = pupilsInGroupData.filter(
    searchFilter(searchQuery ? searchQuery : '', manyPupilSearchFilter)
  );

  const manyPupilsListRendered = manyPupilsListSearchFiltered;

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
                  <Link href={`/amnen-grupper/amne-grupp/${p.groupId}`}>{p.courseName}</Link>
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
              {summerPeriod && (selectedPeriod === 'HT September' || selectedPeriod === 'HT') ? (
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
                  onClick={() => router.push(`/mina-amnen-grupper/amne-grupp/${p.groupId}`)}
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

  // rows group with pupils
  const groupWithPupilsRows = manyPupilsListRendered
    .sort((a: KeyStringTable, b: KeyStringTable) => {
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
                imageUrl={`${p.image}`}
                color="vattjom"
                rounded
                initials={initialsFunction(typeof p.pupil === 'string' && p.pupil ? p.pupil : '')}
                size="sm"
                accent
              />
              {headmaster ? (
                <span className="ml-8 font-bold">
                  <Link href={`/klasser/klass/elev/${p.id}`}>{p.pupil}</Link>
                </span>
              ) : (
                <span className="ml-8 font-bold">
                  {myClasses.find((x) => x.groupName === p.className) ? (
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
                {myClasses.find((x) => x.groupName === p.className) ? (
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
            {headmaster ? (
              <div className="flex items-center gap-2">
                {summerPeriod && (selectedPeriod === 'HT September' || selectedPeriod === 'HT') ? (
                  <Label inverted rounded color="juniskar">
                    Inga prognoser under sommaren
                  </Label>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            ) : (
              <>
                {summerPeriod && (selectedPeriod === 'HT September' || selectedPeriod === 'HT') ? (
                  <Label inverted rounded color="juniskar">
                    Inga prognoser under sommaren
                  </Label>
                ) : (
                  <EditForecast
                    pupil={
                      p && {
                        pupilId: p.id && typeof p.id === 'string' ? p.id : '',
                        groupId: p.groupId && typeof p.groupId === 'string' ? p.groupId : '',
                        period:
                          p.forecastPeriod && typeof p.forecastPeriod === 'string' ? p.forecastPeriod : selectedPeriod,
                        schoolYear:
                          p.schoolYear && typeof p.schoolYear === 'number' ? p.schoolYear : selectedSchoolYear,
                      }
                    }
                    forecast={p.forecast === null || typeof p.forecast !== 'number' ? null : p.forecast}
                  />
                )}
              </>
            )}
          </Table.Column>
        </Table.Row>
      );
    });

  const rowdata = isSinglePupil ? pupilRows : groupWithPupilsRows;
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
          pages={Math.ceil(
            isSinglePupil ? singlepPupilListRendered.length / _pageSize : manyPupilsListRendered.length / _pageSize
          )}
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

  const pupilTable = (
    <Table
      dense={rowHeight === 'dense'}
      background={true}
      className={`${rowdata.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-48'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {isSinglePupil ? pupilHeaders : groupHeaders}
      </Table.Header>
      <Table.Body>{isSinglePupil ? pupilRows : groupWithPupilsRows}</Table.Body>
      {footer}
    </Table>
  );

  return {
    pupilsInGroupData,
    groupWithPupils,
    pupil,
    pupilRows,
    pupilHeaders,
    footer,
    pupilTable,
    groupWithPupilsIsLoading,
    singlePupilIsLoading,
    singlepPupilListRendered,
    manyPupilsListRendered,
    pageSize,
  };
};
