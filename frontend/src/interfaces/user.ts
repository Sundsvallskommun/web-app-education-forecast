export interface User {
  personId: string;
  name: string;
  username: string;
  roles: [{ role: string; typeOfSchool: string }];
  school: string;
  // permissions: Permissions;
}
