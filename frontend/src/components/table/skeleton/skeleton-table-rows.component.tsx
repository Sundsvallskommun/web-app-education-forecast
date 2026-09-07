import { Table } from '@sk-web-gui/react';
import { useId, useState } from 'react';
import { Skeleton } from '../../skeleton/skeleton.component';

interface SkeletonTableColumn {
  element?: React.ReactNode;
  /**
   * min size in rem
   */
  minSize?: number;
  /**
   * max size in rem
   */
  maxSize?: number;
  /**
   * height in rem
   * @default 2.4
   */
  height?: number;
}

interface SkeletonTableRowsProps {
  cols?: SkeletonTableColumn[];
  rows?: number;
}

export const SkeletonTableColumns: React.FC<SkeletonTableRowsProps> = (props) => {
  const {
    cols = [
      { minSize: 10, maxSize: 25 },
      { minSize: 24, maxSize: 36 },
      { element: <Skeleton className="h-40 w-80 !rounded-button">Laddar</Skeleton> },
    ] as SkeletonTableColumn[],
    rows = 10,
  } = props;
  const id = useId();

  const [widths] = useState(() =>
    Array.from({ length: rows }, (_, rowIndex) =>
      cols.map((col, colIndex) => {
        const minSize = col?.minSize ?? col?.maxSize ?? 10;
        const maxSize = col?.maxSize ?? col?.minSize ?? 25;
        const step = (rowIndex * 7 + colIndex * 3) % 5;
        return minSize + ((maxSize - minSize) * step) / 4;
      })
    )
  );

  return widths.map((rowWidths, rowIndex) => (
    <Table.Row key={`skeletonrow-${id}-${rowIndex}`}>
      {cols.map((col, colIndex) => (
        <Table.Column key={`skeletonrow-${id}-${rowIndex}-${colIndex}`}>
          {col.element ?? (
            <Skeleton style={{ width: `${rowWidths[colIndex]}rem`, height: `${col?.height ?? 2.4}rem` }}>-</Skeleton>
          )}
        </Table.Column>
      ))}
    </Table.Row>
  ));
};
