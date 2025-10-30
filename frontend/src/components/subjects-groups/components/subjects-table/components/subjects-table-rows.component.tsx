import { useUserStore } from '@services/user-service/user-service';
import { Avatar, Table } from '@sk-web-gui/react';
import { hasRolePermission } from '@utils/has-role-permission';
import { shallow } from 'zustand/shallow';
import { ISubjects } from '../subjects-table.components';
import { SubjectsTableBadgeColumn } from './subjects-table-badgecolumn.component';
import { SubjectsTableTeacherColumns } from './subjects-table-teachercolumn.component';
import Link from 'next/link';

interface SubjectsTableRowsProps {
  subjects: ISubjects[];
}

export interface SubjectsTableGroupProps {
  group: ISubjects;
}

export const SubjectsTableRows: React.FC<SubjectsTableRowsProps> = ({ subjects }) => {
  const user = useUserStore((state) => state.user);
  const { headmaster, mentor, teacher } = hasRolePermission(user);
  const selectedSchool = useUserStore((state) => state.selectedSchool, shallow);
  const getLink = (group: ISubjects) => {
    if (headmaster) {
      return `/amnen-grupper/amne-grupp/${group.id}-syllabus-${group.syllabusId}/`;
    }
    return `/mina-amnen-grupper/${selectedSchool.schoolId}/amne-grupp/${group.id}-syllabus-${group.syllabusId}`;
  };

  return subjects.map((group) => {
    return (
      <Table.Row key={`row-${group.id}`}>
        <Table.HeaderColumn scope="row">
          <div className="flex items-center gap-2">
            <Avatar
              color="vattjom"
              rounded
              initials={`${group.groupName && typeof group.groupName === 'string' && group.groupName.split('').slice(0, 2)}`}
              size="sm"
              accent
            />
            <span className="ml-8 font-bold cursor-pointer">
              <Link className="sk-link sk-link-primary" href={getLink(group)}>
                {group.groupName}
              </Link>
            </span>
          </div>
        </Table.HeaderColumn>
        {!mentor && !teacher && <SubjectsTableTeacherColumns group={group} />}
        <Table.Column>
          <span>{typeof group.totalPupils === 'number' && group.totalPupils}</span>
        </Table.Column>
        <Table.Column>
          <div className="flex items-center gap-2">
            <span className="ml-8">{group.presence ? `${group.presence}%` : '-'}</span>
          </div>
        </Table.Column>
        <SubjectsTableBadgeColumn property="approvedPupils" color="gronsta" group={group} />
        <SubjectsTableBadgeColumn property="warningPupils" color="warning" group={group} />
        <SubjectsTableBadgeColumn property="unapprovedPupils" color="error" group={group} />
        <SubjectsTableBadgeColumn property="notFilledIn" color="tertiary" group={group} />
      </Table.Row>
    );
  });
};
