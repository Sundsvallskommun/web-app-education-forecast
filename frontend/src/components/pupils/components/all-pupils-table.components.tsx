import { Avatar, Link, Table, SortMode, Pagination, Select, Input, Badge } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { initialsFunction } from '@utils/initials';
import { ForecastMyGroupTeacher } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { IAllPupilsTable, PupilsTableForm } from '../all-pupils.component';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';

interface PupilHeaders {
  label: string;
  property: keyof IAllPupilsTable;
  isColumnSortable: boolean;
}

interface IPupil {
  id?: string | null;
  pupil?: string | null;
  className?: string | null;
  unitId?: string | null;
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

export const AllPupilsTable: React.FC = () => {
  const router = useRouter();
  const allPupils = usePupilForecastStore((s) => s.allPupils);
  const [allPupilsTable, setAllPupilTable] = useState<IPupil[]>([]);

  const { watch, setValue, register, formState } = useFormContext<PupilsTableForm>();
  const sortOrder = watch('sortOrder');
  const sortColumn = watch('sortColumn');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pageSize = watch('pageSize');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalPages = watch('totalPages');
  const page = watch('page');

  const TableSortOrder = sortOrder === 'ASC' ? SortMode.ASC : SortMode.DESC;

  useEffect(() => {
    const tableArr: IPupil[] = [];
    if (allPupils.data.length !== 0) {
      allPupils.data.map((p) => {
        const numberNotFilledIn =
          (p?.totalSubjects || 0) - (p?.approved || 0) - (p?.warnings || 0) - (p?.unapproved || 0);
        tableArr.push({
          id: p.pupil,
          pupil: `${p.givenname} ${p.lastname}`,
          className: p.className,
          unitId: p.unitId,
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

  const [rowHeight, setRowHeight] = useState<string>('normal');

  const pupilHeaderLabels: PupilHeaders[] = [
    { label: 'Namn', property: 'pupil', isColumnSortable: true },
    { label: 'Klass', property: 'className', isColumnSortable: true },
    { label: 'mentor', property: 'teachers', isColumnSortable: true },
    { label: 'Närvaro', property: 'presence', isColumnSortable: true },
    { label: 'Når målen', property: 'approved', isColumnSortable: true },
    { label: 'Uppmärksammad', property: 'warnings', isColumnSortable: true },
    { label: 'Når ej målen', property: 'unapproved', isColumnSortable: true },
    { label: 'Inte ifyllda', property: 'notFilledIn', isColumnSortable: false },
  ];

  const handleSort = (h: PupilHeaders) => {
    setValue('sortOrder', sortOrder === 'DESC' ? 'ASC' : 'DESC');

    setValue(
      'sortColumn',
      h.property
        ? h.property === 'pupil'
          ? 'Givenname'
          : h.property.charAt(0).toUpperCase() + h.property.slice(1)
        : 'Givenname'
    );
  };

  const pupilHeaders = pupilHeaderLabels.map((h, idx) => {
    return (
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
    );
  });

  //rows all pupils
  const pupilRows = allPupilsTable.map((p, idx: number) => {
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
            <span className="ml-8 font-bold cursor-pointer">
              {p.totalSubjects !== 0 ? (
                <Link onClick={() => router.push(`/klasser/klass/elev/${p.id}`)}>{p.pupil}</Link>
              ) : (
                <>{typeof p.pupil === 'string' && p.pupil} </>
              )}
            </span>
          </div>
        </Table.HeaderColumn>
        <Table.Column>
          <Link className="cursor-pointer" onClick={() => router.push(`/klasser/klass/${p.groupId}`)}>
            {p.className}
          </Link>
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
          pages={allPupils.totalPages}
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
      className={`${pupilRows.length > 10 && 'h-[689px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {pupilHeaders}
      </Table.Header>
      <Table.Body>{pupilRows}</Table.Body>
      {footer}
    </Table>
  );
};
