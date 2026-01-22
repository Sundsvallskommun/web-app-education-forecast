import { Table } from '@sk-web-gui/react';
import { useId } from 'react';
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
  const getLength = (max: number, min: number) => {
    return Math.random() * (max - min + 1) + min;
  };

  return Array.from(new Array(rows)).map((row) => (
    <Table.Row key={`skeletonrow-${id}-${row}`}>
      {cols?.map((col, index) => {
        const minSize = col?.minSize ?? col?.maxSize ?? 10;
        const maxSize = col?.maxSize ?? col?.minSize ?? 25;
        const height = col?.height ?? 2.4;
        return (
          <Table.Column key={`skeletonrow-${id}-${row}-${index}`}>
            {col.element ?? (
              <Skeleton style={{ width: `${getLength(maxSize, minSize)}rem`, height: `${height}rem` }}>-</Skeleton>
            )}
          </Table.Column>
        );
      })}
    </Table.Row>
  ));
};
