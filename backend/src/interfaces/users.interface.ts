export type User = {
  personId: string;
  username: string;
  name: string;
  givenName: string;
  surname: string;
  roles: [{ role: string; typeOfSchool: string }];
  school: string;
};

export type ClientUser = {
  personId: string;
  name: string;
  username: string;
  roles: [{ role: string; typeOfSchool: string }];
  school: string;
};
