import { Skeleton } from '@components/skeleton/skeleton.component';
import { TableFooter } from '@components/table/footer/table-footer.component';
import { SkeletonTableColumns } from '@components/table/skeleton/skeleton-table-rows.component';
import { GridForecast, KeyStringTable } from '@interfaces/forecast/forecast';
import { User } from '@interfaces/user';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { Icon, SortMode, Table } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { Check, Minus, X } from 'lucide-react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

interface MentorClassHeaders {
  label: string;
  property: string;
  isColumnSortable: boolean;
}
interface IMentorClassTable {
  user: User;
  searchQuery: string;
  loaded: boolean;
}

export const MentorClassTable: React.FC<IMentorClassTable> = ({ user, searchQuery, loaded }) => {
  const { headmaster, mentor } = hasRolePermission(user);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);
  const [mentorClassData, setMentorClassData] = useState<KeyStringTable[]>([]);
  const [subjectHeaders, setSubjectHeaders] = useState<MentorClassHeaders[]>([]);
  const [pageSize, setPageSize] = useState<number>(mentor || headmaster ? mentorClass.length || 10 : 10);
  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowHeight, setRowHeight] = useState<string>('normal');

  const [sortColumn, setSortColumn] = useState<string>('pupil');

  useEffect(() => {
    if (mentorClass.length > pageSize) {
      setPageSize(mentorClass.length);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, mentorClass]);

  useEffect(() => {
    const tableArr: KeyStringTable[] = [];
    const subjectArr: MentorClassHeaders[] = [];
    if (mentorClass.length !== 0) {
      mentorClass.map((pupil) => {
        const allSubjects = pupil.forecasts?.reduce((accumulator: GridForecast[], current) => {
          if (!accumulator.find((item: GridForecast) => item.courseId === current.courseId)) {
            accumulator.push(current);
          }
          return accumulator;
        }, []);

        allSubjects?.forEach((s) => {
          if (!subjectArr.find((x) => x.label === s.courseId))
            subjectArr.push({ label: s.courseId, property: s.courseId, isColumnSortable: true });
        });

        const numberNotFilledIn = pupil.forecasts?.filter((x) => x.forecast === null).length;
        const object = {
          id: pupil.pupil,
          pupil: `${pupil.givenname} ${pupil.lastname}`,
          unitId: pupil.unitId,
          className: pupil.className,
          presence: pupil.presence,
          notFilledIn: numberNotFilledIn,
        };

        pupil.forecasts?.map((f) => {
          const forecastObj = {
            [f.courseId]: f.forecast,
          };
          Object.assign(object, forecastObj);
        });

        tableArr.push(object);
      });
    }

    setSubjectHeaders(subjectArr);
    setMentorClassData(tableArr);
  }, [mentorClass]);

  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const loadingHeaders = [2, 4, 2, 6, 3, 3, 4].map((nameLength, index) => (
    <Table.HeaderColumn key={`loadingHeader-${index}-${nameLength}`}>
      <Skeleton className="h-24" style={{ width: `${nameLength}rem` }}>
        -
      </Skeleton>
    </Table.HeaderColumn>
  ));

  const mentorclassGridHeaderLabels = [
    { label: 'Namn', property: 'pupil', isColumnSortable: true },
    ...(loaded ? subjectHeaders : []),
  ];

  const mentorClassHeaders = mentorclassGridHeaderLabels.map((h, idx) => {
    return (
      <Table.HeaderColumn
        sticky={h.label === 'Namn'}
        className={`${idx !== 0 && (mentor || headmaster) ? 'flex justify-center border-r-1 !border-gray-200 !pl-4 !pr-4 !py-0' : null}`}
        key={`headercol-${idx}`}
        aria-sort={sortColumn === h.property ? sortOrder : 'none'}
      >
        {idx === 0 ? (
          <div className={`${mentor || (headmaster && 'min-w-[174px]')}`}>
            <Table.SortButton
              disabled={!loaded}
              isActive={sortColumn === h.property}
              aria-description={sortColumn === h.property ? undefined : 'sortera'}
              sortOrder={sortOrder}
              onClick={() => handleSort(h.property)}
            >
              {h.label}
            </Table.SortButton>
          </div>
        ) : (
          <div>
            <span className="block">{h.label.slice(0, 4)}</span>
            <span>{h.label.slice(4)}</span>
          </div>
        )}
      </Table.HeaderColumn>
    );
  });

  const allHeaders = [...mentorClassHeaders, ...(loaded ? [] : loadingHeaders)];

  const mentorClassListSearchFiltered = mentorClassData
    .filter((p) => {
      if (searchQuery && searchQuery !== '') {
        return p?.pupil?.toString().toLowerCase().includes(searchQuery?.toLowerCase());
      } else return p;
    })
    .sort((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return `${a[sortColumn]}` < `${b[sortColumn]}` ? order : `${a[sortColumn]}` > `${b[sortColumn]}` ? order * -1 : 0;
    });

  const iconType = (prop: number) => {
    if (prop === 1) {
      return <Check />;
    } else if (prop === 2) {
      return <Minus />;
    } else if (prop === 3) {
      return <X />;
    }
  };

  const iconColor = (prop: number) => {
    if (prop === 1) {
      return 'gronsta';
    } else if (prop === 2) {
      return 'warning';
    } else if (prop === 3) {
      return 'error';
    }
  };

  const getColIcon = (label: string, pupil: KeyStringTable) => {
    if (!(label in pupil)) return;
    if (pupil?.[label] === null) {
      return <Icon size={14} icon={<Minus />} />;
    }
    return (
      <Icon.Padded inverted color={iconColor(Number(pupil[label]))} rounded icon={iconType(Number(pupil[label]))} />
    );
  };

  const getPupilLink = (pupil: KeyStringTable) => {
    const pupilname = typeof pupil.pupil === 'string' ? pupil.pupil : '';
    const pupilid = typeof pupil.id === 'string' ? pupil.id : '';
    if (headmaster) {
      return (
        <NextLink className="sk-link sk-link-primary" href={`/klasser/klass/elev/${pupilid}`}>
          {pupilname}
        </NextLink>
      );
    }
    if (pupil.notFilledIn === undefined || pupil.notFilledIn === null) {
      return <span>{pupilname} </span>;
    }
    return (
      <NextLink className="sk-link sk-link-primary" href={`/min-mentorsklass/elev/${pupilid}`}>
        {pupilname}
      </NextLink>
    );
  };

  const loadingCols = [{ minSize: 7, maxSize: 20 }];

  const mentorclassRows = mentorClassListSearchFiltered
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .map((pupil, idx: number) => {
      return (
        <Table.Row
          key={`row-${idx}`}
          className={`${
            pupil.forecast === 1 &&
            'border-b-1 border-gray-300 bg-success-background-200 hover:bg-success-background-100'
          } ${
            pupil.forecast === 2 &&
            'border-b-1 border-gray-300 bg-warning-background-200 hover:bg-warning-background-100'
          } ${pupil.forecast === 3 && 'border-b-1 border-gray-300 bg-error-background-200 hover:bg-error-background-100'}`}
        >
          <Table.HeaderColumn scope="row" sticky>
            <div className="flex flex-col py-2 gap-6 min-w-[177px]">
              <span data-cy={`pupil-${idx}-name`}>{getPupilLink(pupil)}</span>
              <span data-cy={`pupil-${idx}-presence`}>
                Närvaro: {typeof pupil.presence === 'number' && pupil.presence}%
              </span>
            </div>
          </Table.HeaderColumn>
          {subjectHeaders.map((subject, index) => {
            return (
              <Table.Column key={index} className={`${index === 0 ? 'border-l-1' : null} border-r-1 !p-0`}>
                <div className="w-full flex justify-center items-center">{getColIcon(subject.label, pupil)}</div>
              </Table.Column>
            );
          })}
        </Table.Row>
      );
    });

  return loaded && mentorClassListSearchFiltered.length < 1 ? (
    <div className="flex justify-center">
      <p className="max-w-[1600px] w-full">Inga sökresultat att visa</p>
    </div>
  ) : (
    <Table
      scrollable
      dense={rowHeight === 'dense'}
      background={true}
      className={`${mentorClassListSearchFiltered.length > 10 && 'h-[800px] rounded-b-0 border-b-0 mb-28'}`}
      data-cy="mentor-class-table"
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {allHeaders}
      </Table.Header>
      <Table.Body>{loaded ? mentorclassRows : <SkeletonTableColumns cols={loadingCols} />}</Table.Body>
      <Table.Footer
        className={
          mentorClassListSearchFiltered.length > 10 ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''
        }
      >
        <TableFooter
          pageSize={pageSize}
          onChangePageSize={setPageSize}
          pages={Math.ceil(mentorClassListSearchFiltered.length / pageSize)}
          activePage={currentPage}
          onChangePage={setCurrentPage}
          rowHeight={rowHeight}
          onChangeRowHeight={setRowHeight}
          loaded={loaded}
        />
      </Table.Footer>
    </Table>
  );
};
