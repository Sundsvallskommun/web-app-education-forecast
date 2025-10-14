export interface User {
  personId: string;
  name: string;
  username: string;
  roles: [{ role: string; typeOfSchool: string }];
  schools: [{ schoolId: string; schoolName: string }];
}
