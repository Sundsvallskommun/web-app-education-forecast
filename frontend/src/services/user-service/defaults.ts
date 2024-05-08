import { User } from '@interfaces/user';
import { ApiResponse } from '@services/api-service';

// export const defaultPermissions: Permissions = {
//   //   canEditSystemMessages: false,
// };

export const emptyUser: User = {
  personId: '',
  name: '',
  username: '',
  roles: [
    {
      role: '',
      typeOfSchool: '',
    },
  ],
  school: '',
  //   permissions: defaultPermissions,
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};
