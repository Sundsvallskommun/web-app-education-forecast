import {
  //   clearGroupForecastsDto,
  CopyPreviousForecastDto,
  ForeacastQueriesDto,
  MentorClassPupilGrid,
  //   CopyPreviousForecastDto,
  //   MentorClassPupil,
  //   MyGroup,
  //   QueriesDto,
  //   Pupil,
  //   SetForecastDto,
  //   clearGroupForecastsDto,
  //   MentorClassPupilGrid,
  MetaGroup,
  MetaMentorClass,
  MetaPupils,
  MyGroup,
  Pupil,
  SetForecastDto,
} from '@interfaces/forecast/forecast';
import { ApiResponse, apiService } from '../api-service';
// import { createWithEqualityFn } from 'zustand/traditional';
// import { devtools, persist } from 'zustand/middleware';
// import { __DEV__ } from '@sk-web-gui/react';
// import { emptyMyGroup } from './defaults';
import { ServiceResponse } from '@interfaces/service';
// import { callbackType } from '@utils/callback-type';
// import { apiURL } from '@utils/api-url';
// import { User } from '@interfaces/user';
// import { hasRolePermission } from '@utils/has-role-permission';
// import dayjs from 'dayjs';
import {
  handleCopyForecast,
  handleGetManyPupils,
  handleGetMentorClassGrid,
  handleGetMetaGroupResponse,
  handleGetMetapupils,
  handleSendForecast,
} from './data-handlers/pupilforecast';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, persist } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';

export const getSubjects: (
  schoolId: string,
  OrderBy: string,
  OrderDirection: string,
  PageNumber?: number | null,
  PageSize?: number | null,
  periodId?: number | null,
  searchFilter?: string | null,
  signal?: AbortSignal
) => Promise<ServiceResponse<MetaGroup>> = (
  schoolId,
  OrderBy,
  OrderDirection,
  PageNumber,
  PageSize,
  periodId,
  searchFilter,
  signal
) => {
  return apiService
    .get<ApiResponse<MetaGroup>>(`/pupilforecast/mygroups/${schoolId}`, {
      params: { OrderBy, OrderDirection, periodId, groupType: 'G', searchFilter, PageNumber, PageSize },
      signal,
    })
    .then((res) => ({ data: handleGetMetaGroupResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getClasses: (
  schoolId: string,
  OrderBy: string,
  OrderDirection: string,
  PageNumber?: number | null,
  PageSize?: number | null,
  periodId?: number | null,
  searchFilter?: string | null,
  signal?: AbortSignal
) => Promise<ServiceResponse<MetaGroup>> = (
  schoolId,
  OrderBy,
  OrderDirection,
  PageNumber,
  PageSize,
  periodId,
  searchFilter,
  signal
) => {
  return apiService
    .get<ApiResponse<MetaGroup>>(`/pupilforecast/mygroups/${schoolId}`, {
      params: { OrderBy, OrderDirection, periodId, groupType: 'K', searchFilter, PageNumber, PageSize },
      signal,
    })

    .then((res) => ({ data: handleGetMetaGroupResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getAllPupils: (
  periodId: number,
  schoolId: string,
  searchFilter?: string,
  PageNumber?: number,
  PageSize?: number,
  OrderBy?: string,
  OrderDirection?: string,
  signal?: AbortSignal
) => Promise<ServiceResponse<MetaPupils>> = (
  schoolId,
  periodId,
  searchFilter,
  PageNumber,
  PageSize,
  OrderBy,
  OrderDirection,
  signal
) => {
  return apiService
    .get<ApiResponse<MetaPupils>>(`/pupilforecast/${schoolId}/allpupils`, {
      params: { periodId, searchFilter, PageNumber, PageSize, OrderBy, OrderDirection },
      signal,
    })
    .then((res) => ({ data: handleGetMetapupils(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getMentorClass: (
  groupId: string,
  periodId?: number,
  signal?: AbortSignal
) => Promise<ServiceResponse<MentorClassPupilGrid[]>> = (groupId, periodId, signal) => {
  return apiService
    .get<ApiResponse<MentorClassPupilGrid[]>>(`/pupilforecast/mentorclass/${groupId}/grid`, {
      params: { periodId },
      signal,
    })
    .then((res) => ({ data: handleGetMentorClassGrid(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getPupil: (
  pupilId: string,
  periodId: string,
  unitId: string,
  signal?: AbortSignal
) => Promise<ServiceResponse<Pupil[]>> = (pupilId, periodId, unitId, signal) => {
  return apiService
    .get<ApiResponse<Pupil[]>>(`/pupilforecast/${unitId}pupil/${pupilId}`, { params: { periodId }, signal })
    .then((res) => ({ data: handleGetManyPupils(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getSubjectWithPupils: (
  groupId: string,
  syllabusId: string,
  periodId: string,
  signal?: AbortSignal
) => Promise<ServiceResponse<Pupil[]>> = (groupId, syllabusId, periodId, signal) => {
  return apiService
    .get<ApiResponse<Pupil[]>>(`/pupilforecast/pupilsbygroup/${groupId}/${syllabusId}`, {
      params: { periodId },
      signal,
    })
    .then((res) => ({ data: handleGetManyPupils(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const setForecast: (forecast: SetForecastDto) => Promise<ServiceResponse<object>> = (forecast) => {
  return apiService
    .post<ApiResponse<object>>(`/pupilforecast/setforecast`, handleSendForecast(forecast))
    .then((res) => ({ data: res.data }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const copyPreviousForecast: (forecast: CopyPreviousForecastDto) => Promise<ServiceResponse<object>> = (
  forecast
) => {
  return apiService
    .post<ApiResponse<object>>(`/pupilforecast/copypreviousforecast`, handleCopyForecast(forecast))
    .then((res) => ({ data: res.data }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const clearGroupForecasts: (groupId: string, syllabusId: string) => Promise<ServiceResponse<object>> = (
  groupId,
  syllabusId
) => {
  return apiService
    .delete<ApiResponse<object>>(`/pupilforecast/cleargroupforecasts/${groupId}/${syllabusId}`)
    .then((res) => ({ data: res.data }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

interface State {
  subjectsIsLoading: boolean;
  classesIsLoading: boolean;
  mentorClassIsLoading: boolean;
  pupilsIsLoading: boolean;
  singlePupilIsLoading: boolean;
  mySubjects: MetaGroup;
  subject: Pupil[];
  myClasses: MetaGroup;
  mentorClass: MetaMentorClass;
  classDetails: MyGroup;
  allPupils: MetaPupils;
  pupil: Pupil[];
  selectedPeriod: number | null;
  selectedId?: string | null;
}

interface Actions {
  setSubjects: (mySubjects: MetaGroup | ((prevState: MetaGroup) => MetaGroup)) => Promise<void>;
  setClasses: (myClasses: MetaGroup | ((prevState: MetaGroup) => MetaGroup) | undefined) => Promise<void>;
  //   setGroup: (classes: MyGroup) => void;
  //   setSingleSubject: (groupWithPupils: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<void>;
  //   //setPreviousPeriodGroup: (groupWithPupils: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<void>;
  //   setMentorClass: (mentorClass: MetaMentorClass | ((prevState: MetaMentorClass) => MetaMentorClass)) => Promise<void>;
  //   setClassDetails: (classDetails: MyGroup) => void;
  //   setAllPupils: (allPupils: MetaPupils | ((prevState: MetaPupils) => MetaPupils)) => Promise<void>;
  //   setPupil: (pupil: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<void>;
  //   //   setSelectedPeriod: (
  //   //     selectedPeriod: string,
  //   //     selectedSchoolYear: number,
  //   //     callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil',
  //   //     objectId?: string | null,
  //   //     user?: User
  //   //   ) => Promise<void>;
  getMySubjects: (body: ForeacastQueriesDto) => Promise<ServiceResponse<MetaGroup>>;
  //   // getGroup: (groupId: string) => Promise<ServiceResponse<MyGroup>>;
  //   getSubjectWithPupils: (groupId: string, queries: ForeacastQueriesDto) => Promise<ServiceResponse<Pupil[]>>;
  //   getPreviousPeriodGroup: (groupId: string, queries: ForeacastQueriesDto) => Promise<ServiceResponse<Pupil[]>>;
  getMyClasses: (body: ForeacastQueriesDto) => Promise<ServiceResponse<MetaGroup>>;
  //   getClassDetails: (groupId: string, period: string) => Promise<ServiceResponse<MyGroup>>;
  //   getMentorClass: (groupId: string, queries: ForeacastQueriesDto) => Promise<ServiceResponse<MetaMentorClass>>;
  //   getAllPupils: (queries: ForeacastQueriesDto) => Promise<ServiceResponse<MetaPupils>>;
  //   getPupil: (pupilId: string, period: string, schoolYear: number) => Promise<ServiceResponse<Pupil[]>>;
  //   setForecast: (forecast: SetForecastDto) => Promise<ServiceResponse<object>>;
  //   copyPreviousForecast: (forecast: CopyPreviousForecastDto) => Promise<ServiceResponse<object>>;
  //   clearGroupForecasts: (forecast: clearGroupForecastsDto) => Promise<ServiceResponse<object>>;
  reset: () => void;
}

const initialState: State = {
  subjectsIsLoading: true,
  classesIsLoading: true,
  mentorClassIsLoading: true,
  pupilsIsLoading: true,
  singlePupilIsLoading: true,
  mySubjects: {
    pageNumber: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    data: [],
  },
  subject: [],
  myClasses: {
    pageNumber: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    data: [],
  },
  mentorClass: {
    pageNumber: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    data: [],
  },
  classDetails: {
    groupId: '',
    groupType: '',
    totalPupils: null,
    approvedPupils: null,
    warningPupils: null,
    unapprovedPupils: null,
  },
  allPupils: {
    pageNumber: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    data: [],
  },
  pupil: [],
  selectedPeriod: null,
  selectedId: '',
};

export const usePupilForecastStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        selectedPeriod: number | null;
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setClasses: async (myClasses) =>
          await set((s) => ({
            myClasses: typeof myClasses === 'function' ? myClasses(s.myClasses) : myClasses,
          })),
        getMyClasses: async (body: ForeacastQueriesDto) => {
          const fPeriod = body.periodId || get().selectedPeriod;
          if (fPeriod == null) {
            await set(() => ({
              myClasses: initialState.myClasses,
            }));
            await get().reset();
          }
          await set(() => ({ classesIsLoading: true }));
          const res = await getClasses(
            body.schoolId,
            body.OrderBy,
            body.OrderDirection,
            body.PageNumber,
            body.PageSize,
            body.periodId,
            body.searchFilter
          );
          const data = (res.data && res.data) || initialState.myClasses;
          await set(() => ({ myClasses: data, classesIsLoading: false }));
          await set(() => ({
            classesIsLoading: false,
          }));
          return { data, error: res.error };
        },
        setSubjects: async (mySubjects) =>
          await set((s) => ({
            mySubjects: typeof mySubjects === 'function' ? mySubjects(s.mySubjects) : mySubjects,
          })),
        getMySubjects: async (body: ForeacastQueriesDto) => {
          const fPeriod = body.periodId || get().selectedPeriod;

          if (fPeriod == null) {
            await set(() => ({
              mySubjects: initialState.mySubjects,
            }));
            await get().reset();
          }
          await set(() => ({ subjectsIsLoading: true }));
          const res = await getSubjects(
            body.schoolId,
            body.OrderBy,
            body.OrderDirection,
            body.PageNumber,
            body.PageSize,
            body.periodId,
            body.searchFilter
          );
          const data = (res.data && res.data) || initialState.mySubjects;
          await set(() => ({ mySubjects: data, subjectsIsLoading: false }));

          await set(() => ({
            subjectsIsLoading: false,
          }));
          return { data, error: res.error };
        },
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'pupilforecast-storage',
        version: 1,
        partialize: ({ selectedPeriod }) => ({
          selectedPeriod,
        }),
      }
    ),
    { enabled: __DEV__ }
  )
);
