import { Table } from '@sk-web-gui/react';
import { SubjectsTableGroupProps } from './subjects-table-rows.component';

export const SubjectsTableTeacherColumns: React.FC<SubjectsTableGroupProps> = ({ group }) => {
  return (
    <Table.Column>
      <div className="flex max-w-[300px] items-center gap-2">
        <span className="ml-8">
          {!!group.teachers && group.teachers.length > 0 ? (
            group.teachers?.map((teacher, index, arr) => {
              const fullName = `${teacher.givenname} ${teacher.lastname}`;
              const nameArr = fullName.split('');
              const initials = nameArr.filter(function (char) {
                return /[A-Z]/.test(char);
              });

              const secondletterInLastName = teacher.lastname?.split('').slice(1, 2);
              const abbreviation = `${initials.join('')}${secondletterInLastName}`;
              return (
                <span key={`teacher-${teacher.personId}`}>
                  {teacher?.givenname} {teacher?.lastname} ({abbreviation}){index === arr.length - 1 ? '' : ', '}
                </span>
              );
            })
          ) : (
            <span> - </span>
          )}
        </span>
      </div>
    </Table.Column>
  );
};
