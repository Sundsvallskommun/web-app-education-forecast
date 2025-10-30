import { User } from '@interfaces/user';
import { ApiResponse } from '@services/api-service';

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
  schools: [{ schoolId: '', schoolName: '' }],
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};
