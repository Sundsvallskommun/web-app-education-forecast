import { User } from '@interfaces/user';
import { ApiResponse, apiService } from '../api-service';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';
import { emptyUser } from './defaults';
import { ServiceResponse } from '@interfaces/service';

const handleSetUserResponse: (res: ApiResponse<User>) => User = (res) => ({
  personId: res.data.personId,
  name: res.data.name,
  username: res.data.username,
  roles: res.data.roles,
  schools: res.data.schools,
  // permissions: res.data.permissions,
});

const getMe: () => Promise<ServiceResponse<User>> = () => {
  return apiService
    .get<ApiResponse<User>>('me')
    .then((res) => ({ data: handleSetUserResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

interface State {
  user: User;
  selectedSchool: {
    schoolId: string;
    schoolName: string;
  };
}
interface Actions {
  setUser: (user: User) => void;
  setSelectedShool: (selectedSchool: { schoolId: string; schoolName: string }) => void;
  getMe: () => Promise<ServiceResponse<User>>;
  reset: () => void;
}

const initialState: State = {
  user: emptyUser,
  selectedSchool: {
    schoolId: '',
    schoolName: '',
  },
};

export const useUserStore = createWithEqualityFn<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set(() => ({ user })),
      setSelectedShool: (selectedSchool) => set(() => ({ selectedSchool })),
      getMe: async () => {
        let user = get().user;
        const res = await getMe();
        if (!res.error) {
          res.data ? (user = res.data) : (user = emptyUser);
          get().selectedSchool.schoolId && get().selectedSchool.schoolId !== ''
            ? set(() => ({ user: user, selectedSchool: get().selectedSchool }))
            : set(() => ({ user: user, selectedSchool: user.schools[0] }));
        }
        return { data: user };
      },
      reset: () => {
        set(initialState);
      },
    }),
    { enabled: __DEV__ }
  )
);
