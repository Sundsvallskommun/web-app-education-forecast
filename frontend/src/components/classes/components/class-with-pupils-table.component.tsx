import { User } from '@interfaces/user';
import { SortMode, Table, Select, Pagination, Input, Icon } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { useEffect, useState } from 'react';
import { GridForecast, KeyStringTable } from '@interfaces/forecast/forecast';
import { usePupilForecastStore } from '@services/pupilforecast-service/pupilforecast-service';
import { Check, Minus, X } from 'lucide-react';
import { NextLink } from '@sk-web-gui/next';

interface MentorClassHeaders {
  label: string;
  property: string;
  isColumnSortable: boolean;
}
interface IMentorClassTable {
  user: User;
  searchQuery: string;
}

export const MentorClassTable: React.FC<IMentorClassTable> = ({ user, searchQuery }) => {
  const { headmaster, mentor } = hasRolePermission(user);
  const mentorClass = usePupilForecastStore((s) => s.mentorClass);
  const [mentorClassData, setMentorClassData] = useState<KeyStringTable[]>([]);
  const [subjectHeaders, setSubjectHeaders] = useState<MentorClassHeaders[]>([]);
  const [pageSize] = useState<number>(mentor || headmaster ? mentorClass.length : 10);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorClass]);

  const [_pageSize, setPageSize] = useState<number>(pageSize);

  const [sortOrder, setSortOrder] = useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowHeight, setRowHeight] = useState<string>('normal');

  const [sortColumn, setSortColumn] = useState<string>('pupil');

  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const mentorclassGridHeaderLabels = [{ label: 'Namn', property: 'pupil', isColumnSortable: true }, ...subjectHeaders];

  const classHeaderLabels = mentorclassGridHeaderLabels;

  const mentorClassHeaders = classHeaderLabels.map((h, idx) => {
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

  const mentorClassListSearchFiltered = mentorClassData.filter((p) => {
    if (searchQuery && searchQuery !== '') {
      return p?.pupil?.toString().toLowerCase().includes(searchQuery?.toLowerCase());
    } else return p;
  });

  const mentorClassListRendered: KeyStringTable[] | string[] = mentorClassListSearchFiltered;

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
      return <NextLink href={`/klasser/klass/elev/${pupilid}`}>{pupilname}</NextLink>;
    }
    if (pupil.notFilledIn === undefined || pupil.notFilledIn === null) {
      return <span>{pupilname} </span>;
    }
    return <NextLink href={`/min-mentorsklass/elev/${pupilid}`}>{pupilname}</NextLink>;
  };

  const mentorclassRows = mentorClassListRendered
    .sort((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return `${a[sortColumn]}` < `${b[sortColumn]}` ? order : `${a[sortColumn]}` > `${b[sortColumn]}` ? order * -1 : 0;
    })
    .slice((currentPage - 1) * _pageSize, currentPage * _pageSize)
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
              <span>{getPupilLink(pupil)}</span>
              <span>Närvaro: {typeof pupil.presence === 'number' && pupil.presence}%</span>
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

  const footer = (
    <Table.Footer
      className={mentorclassRows.length > pageSize ? 'border-0 outline outline-1 outline-gray-300 rounded-b-18' : ''}
    >
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
          pages={Math.ceil(mentorClassListRendered.length / _pageSize)}
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

  return mentorClassListRendered.length > 0 ? (
    <Table
      scrollable
      dense={rowHeight === 'dense'}
      background={true}
      className={`${mentorclassRows.length > 10 && 'h-[800px] rounded-b-0 border-b-0 mb-28'}`}
    >
      <Table.Header sticky className="border-b-1 border-gray-500 bg-inverted-body">
        {mentorClassHeaders}
      </Table.Header>
      <Table.Body>{mentorclassRows}</Table.Body>
      {footer}
    </Table>
  ) : (
    <div className="flex justify-center">
      <p className="max-w-[1600px] w-full">Inga sökresultat att visa</p>
    </div>
  );
};
