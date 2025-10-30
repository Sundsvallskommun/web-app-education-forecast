import { Badge, BadgeProps, Table } from '@sk-web-gui/react';
import { ISubjects } from '../subjects-table.components';
import { SubjectsTableGroupProps } from './subjects-table-rows.component';

interface SubjectsTableBadgeColumnProps extends SubjectsTableGroupProps {
  color: BadgeProps['color'];
  property: keyof ISubjects;
}

export const SubjectsTableBadgeColumn: React.FC<SubjectsTableBadgeColumnProps> = ({ group, color, property }) => {
  const count = () => {
    if (!!group[property] && typeof group[property] === 'number') {
      return group[property];
    }
    return 0;
  };

  return (
    <Table.Column>
      <div className="flex items-center gap-2">
        <span className="ml-8">
          {group.totalPupils === group.notFilledIn ? (
            '-'
          ) : (
            <Badge rounded inverted={!group[property]} color={group[property] ? color : 'tertiary'} counter={count()} />
          )}
        </span>
      </div>
    </Table.Column>
  );
};
