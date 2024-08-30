import {
  CopyPreviousForecastDto,
  MentorClassPupil,
  MyGroup,
  QueriesDto,
  Pupil,
  SetForecastDto,
  clearGroupForecastsDto,
  MentorClassPupilGrid,
} from '@interfaces/forecast/forecast';
import { ApiResponse, apiService } from '../api-service';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, persist } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';
import { emptyMyGroup } from './defaults';
import { ServiceResponse } from '@interfaces/service';
import {
  handleGetMyGroupsResponse,
  handleGetMentorClass,
  handleGetManyPupils,
  handleSendForecast,
  handleCopyForecast,
  handleGetMentorClassGrid,
} from './data-handlers/foreacast';
import { callbackType } from '@utils/callback-type';
import { apiURL } from '@utils/api-url';
import { User } from '@interfaces/user';
import { hasRolePermission } from '@utils/has-role-permission';

const getMySubjects: (period: string, schoolYear: number, signal?) => Promise<ServiceResponse<MyGroup[]>> = (
  period,
  schoolYear,
  signal
) => {
  return apiService
    .get<ApiResponse<MyGroup[]>>(`/forecast/mygroups`, { params: { period, schoolYear, groupType: 'G' }, signal })
    .then((res) => ({ data: handleGetMyGroupsResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const getGroupWithPupils: (
  groupId: string,
  period: string,
  schoolYear: number,
  signal?
) => Promise<ServiceResponse<Pupil[]>> = (groupId, period, schoolYear, signal) => {
  return apiService
    .get<ApiResponse<Pupil[]>>(`/forecast/pupilsbygroup/${groupId}`, { params: { period, schoolYear }, signal })
    .then((res) => ({ data: handleGetManyPupils(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const getMyClasses: (period: string, schoolYear: number, signal?) => Promise<ServiceResponse<MyGroup[]>> = (
  period,
  schoolYear,
  signal
) => {
  return apiService
    .get<ApiResponse<MyGroup[]>>('/forecast/mygroups', { params: { period, schoolYear, groupType: 'K' }, signal })
    .then((res) => ({ data: handleGetMyGroupsResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const getMentorClass: (
  groupId: string,
  period: string,
  schoolYear: number,
  signal?
) => Promise<ServiceResponse<MentorClassPupil[]>> = (groupId, period, schoolYear, signal) => {
  return apiService
    .get<ApiResponse<MentorClassPupil[]>>(`/forecast/mentorclass/${groupId}`, {
      params: { period, schoolYear },
      signal,
    })
    .then((res) => ({ data: handleGetMentorClass(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const getMentorClassGrid: (
  groupId: string,
  period: string,
  schoolYear: number,
  signal?
) => Promise<ServiceResponse<MentorClassPupilGrid[]>> = (groupId, period, schoolYear, signal) => {
  return apiService
    .get<ApiResponse<MentorClassPupilGrid[]>>(`/forecast/mentorclass/${groupId}/grid`, {
      params: { period, schoolYear },
      signal,
    })
    .then((res) => ({ data: handleGetMentorClassGrid(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const getAllPupils: (period: string, schoolYear: number, signal?) => Promise<ServiceResponse<Pupil[]>> = (
  period,
  schoolYear,
  signal
) => {
  return apiService
    .get<ApiResponse<Pupil[]>>(`/forecast/allpupils`, { params: { period: period, schoolYear: schoolYear }, signal })
    .then((res) => ({ data: handleGetManyPupils(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const getPupil: (pupilId: string, period: string, schoolYear: number, signal?) => Promise<ServiceResponse<Pupil[]>> = (
  pupilId,
  period,
  schoolYear,
  signal
) => {
  return apiService
    .get<ApiResponse<Pupil[]>>(`/forecast/pupil/${pupilId}`, { params: { period, schoolYear }, signal })
    .then((res) => ({ data: handleGetManyPupils(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const setForecast: (forecast: SetForecastDto) => Promise<ServiceResponse<object>> = (forecast) => {
  return apiService
    .post<ApiResponse<object>>(`/forecast/setforecast`, handleSendForecast(forecast))
    .then((res) => ({ data: res.data }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const copyPreviousForecast: (forecast: CopyPreviousForecastDto) => Promise<ServiceResponse<object>> = (forecast) => {
  return apiService
    .post<ApiResponse<object>>(`/forecast/copypreviousforecast`, handleCopyForecast(forecast))
    .then((res) => ({ data: res.data }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const clearGroupForecasts: (groupId: string, period: string, schoolYear: number) => Promise<ServiceResponse<object>> = (
  groupId,
  period,
  schoolYear
) => {
  return apiService
    .delete<ApiResponse<object>>(`/forecast/cleargroupforecasts/${groupId}`, { params: { period, schoolYear } })
    .then((res) => ({ data: res.data }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

interface State {
  listByPeriodIsLoading: boolean;
  groupWithPupilsIsLoading: boolean;
  previousPeriodGroupIsLoading: boolean;
  subjectsIsLoading: boolean;
  classesIsLoading: boolean;
  mentorClassIsLoading: boolean;
  pupilsIsLoading: boolean;
  singlePupilIsLoading: boolean;
  mySubjects: MyGroup[];
  group: MyGroup;
  groupWithPupils: Pupil[];
  previousPeriodGroup: Pupil[];
  myClasses: MyGroup[];
  myGroup: MyGroup;
  mentorClass: MentorClassPupil[];
  mentorClassGrid: MentorClassPupilGrid[];
  classDetails: MyGroup;
  allPupils: Pupil[];
  pupil: Pupil[];
  selectedSchoolYear: number;
  selectedPeriod: string;
  selectedId: string;
}
interface Actions {
  setSubjects: (mySubjects: MyGroup[] | ((prevState: MyGroup[]) => MyGroup[])) => Promise<void>;
  setClasses: (myClasses: MyGroup[] | ((prevState: MyGroup[]) => MyGroup[])) => Promise<void>;
  setGroup: (classes: MyGroup) => void;
  setGroupWithPupils: (groupWithPupils: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<void>;
  setPreviousPeriodGroup: (groupWithPupils: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<void>;
  setMentorClass: (
    groupWithPupils: MentorClassPupil[] | ((prevState: MentorClassPupil[]) => MentorClassPupil[])
  ) => Promise<void>;
  setMentorClassGrid: (
    groupWithPupils: MentorClassPupilGrid[] | ((prevState: MentorClassPupilGrid[]) => MentorClassPupilGrid[])
  ) => Promise<void>;
  setClassDetails: (classDetails: MyGroup) => void;
  setAllPupils: (allPupils: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<void>;
  setPupil: (pupil: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<void>;
  setSelectedPeriod: (
    selectedPeriod: string,
    selectedSchoolYear: number,
    callback: 'classes' | 'mentorclass' | 'subjects' | 'subject' | 'pupils' | 'pupil',
    objectId?: string | null,
    user?: User | null
  ) => Promise<void>;
  getMySubjects: (body: QueriesDto, signal?: AbortSignal) => Promise<ServiceResponse<MyGroup[]>>;
  // getGroup: (groupId: string) => Promise<ServiceResponse<MyGroup>>;
  getGroupWithPupils: (groupId: string, queries: QueriesDto) => Promise<ServiceResponse<Pupil[]>>;
  getPreviousPeriodGroup: (groupId: string, queries: QueriesDto) => Promise<ServiceResponse<Pupil[]>>;
  getMyClasses: (body: QueriesDto) => Promise<ServiceResponse<MyGroup[]>>;
  getClassDetails: (groupId: string, period: string) => Promise<ServiceResponse<MyGroup>>;
  getMentorClass: (
    groupId: string,
    queries: QueriesDto,
    user?: User
  ) => Promise<ServiceResponse<MentorClassPupil[] | MentorClassPupilGrid[]>>;
  getAllPupils: (queries: QueriesDto) => Promise<ServiceResponse<Pupil[]>>;
  getPupil: (pupilId: string, period: string, schoolYear: number) => Promise<ServiceResponse<Pupil[]>>;
  setForecast: (forecast: SetForecastDto) => Promise<ServiceResponse<object>>;
  copyPreviousForecast: (forecast: CopyPreviousForecastDto) => Promise<ServiceResponse<object>>;
  clearGroupForecasts: (forecast: clearGroupForecastsDto) => Promise<ServiceResponse<object>>;
  reset: () => void;
}

const initialState: State = {
  listByPeriodIsLoading: true,
  groupWithPupilsIsLoading: true,
  previousPeriodGroupIsLoading: true,
  subjectsIsLoading: true,
  classesIsLoading: true,
  mentorClassIsLoading: true,
  pupilsIsLoading: true,
  singlePupilIsLoading: true,
  mySubjects: [],
  group: emptyMyGroup,
  groupWithPupils: [],
  previousPeriodGroup: [],
  myClasses: [],
  myGroup: emptyMyGroup,
  mentorClass: [],
  mentorClassGrid: [],
  classDetails: emptyMyGroup,
  allPupils: [],
  pupil: [],
  selectedSchoolYear: null,
  selectedPeriod: '',
  selectedId: '',
};

export const useForecastStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        selectedSchoolYear: number;
        selectedPeriod: string;
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setSelectedPeriod: async (selectedPeriod, selectedSchoolYear, callback, objectId?, user?) => {
          const { CLASSES, SUBJECTS, SUBJECT, MENTORCLASS, PUPILS, PUPIL } = callbackType(callback);
          await set(() => ({
            selectedPeriod: selectedPeriod,
            selectedSchoolYear: selectedSchoolYear,
            selectedId: objectId ? objectId : null,
            listByPeriodIsLoading: true,
          }));

          CLASSES && (await get().getMyClasses({ period: selectedPeriod, schoolYear: selectedSchoolYear }));
          SUBJECTS && (await get().getMySubjects({ period: selectedPeriod, schoolYear: selectedSchoolYear }));
          SUBJECT &&
            objectId &&
            (await get().getGroupWithPupils(objectId, { period: selectedPeriod, schoolYear: selectedSchoolYear })) &&
            (await get().getMySubjects({ period: selectedPeriod, schoolYear: selectedSchoolYear }));
          MENTORCLASS &&
            objectId &&
            (await get().getMentorClass(objectId, { period: selectedPeriod, schoolYear: selectedSchoolYear }, user));
          PUPILS && (await get().getAllPupils({ period: selectedPeriod, schoolYear: selectedSchoolYear }));
          PUPIL &&
            objectId &&
            (await get().getPupil(objectId, selectedPeriod, selectedSchoolYear)) &&
            (await get().getMentorClass(
              get().pupil[0]?.classGroupId,
              {
                period: selectedPeriod,
                schoolYear: selectedSchoolYear,
              },
              user
            ));
          await set(() => ({ listByPeriodIsLoading: false }));
        },
        setSubjects: async (mySubjects) =>
          await set((s) => ({
            mySubjects: typeof mySubjects === 'function' ? mySubjects(s.mySubjects) : mySubjects,
          })),
        getMySubjects: async (body: QueriesDto, signal?) => {
          const fPeriod = body.period || get().selectedPeriod;
          const fSchoolYear = body.schoolYear || get().selectedSchoolYear;
          if (fPeriod == null || fSchoolYear == null) {
            await set(() => ({
              mySubjects: initialState.mySubjects,
            }));
            await get().reset();
          }
          await set(() => ({ subjectsIsLoading: true }));
          const res = await getMySubjects(fPeriod, fSchoolYear, signal);
          const data = (res.data && res.data) || initialState.mySubjects;
          await set(() => ({ mySubjects: data, subjectsIsLoading: false }));

          await set(() => ({
            subjectsIsLoading: false,
          }));
          return { data, error: res.error };
        },
        setGroup: (group) => set(() => ({ group })),
        setGroupWithPupils: async (groupWithPupils) =>
          await set((s) => ({
            groupWithPupils:
              typeof groupWithPupils === 'function' ? groupWithPupils(s.groupWithPupils) : groupWithPupils,
          })),
        getGroupWithPupils: async (groupId: string, queries: QueriesDto, signal?) => {
          const fPeriod = queries.period || get().selectedPeriod;
          const fSchoolYear = queries.schoolYear || get().selectedSchoolYear;
          const dataArr = [];
          if (groupId == null) {
            await set(() => ({
              groupWithPupils: initialState.groupWithPupils,
            }));
            await get().reset();
          }
          await set(() => ({ groupWithPupilsIsLoading: true }));
          const res = await getGroupWithPupils(
            groupId ? groupId : get().groupWithPupils[0].groupId,
            fPeriod,
            fSchoolYear,
            signal
          );

          const data = (res.data && res.data) || initialState.groupWithPupils;
          data.map((d) => {
            const img = apiURL(`/education/${d.pupil}/personimage?width=${68}`);
            dataArr.push({
              ...d,
              image: img.length === 0 || !img ? null : img,
            });
          });
          await set(() => ({ groupWithPupils: dataArr, groupWithPupilsIsLoading: false }));
          return { data, error: res.error };
        },
        setPreviousPeriodGroup: async (previousPeriodGroup) =>
          await set((s) => ({
            previousPeriodGroup:
              typeof previousPeriodGroup === 'function'
                ? previousPeriodGroup(s.previousPeriodGroup)
                : previousPeriodGroup,
          })),
        getPreviousPeriodGroup: async (groupId: string, queries: QueriesDto, signal?) => {
          const fPeriod = queries.period;
          const fSchoolYear = queries.schoolYear;
          const dataArr = [];
          if (groupId == null) {
            await set(() => ({
              previousPeriodGroup: initialState.previousPeriodGroup,
            }));
            await get().reset();
          }
          await set(() => ({ previousPeriodGroupIsLoading: true }));
          //const myClasses = get().myClasses;
          const res = await getGroupWithPupils(
            groupId ? groupId : get().previousPeriodGroup[0]?.groupId,
            fPeriod,
            fSchoolYear,
            signal
          );

          const data = (res.data && res.data) || initialState.previousPeriodGroup;
          data.map((d) => {
            const img = apiURL(`/education/${d.pupil}/personimage?width=${68}`);
            dataArr.push({
              ...d,
              image: img.length === 0 || !img ? null : img,
            });
          });
          await set(() => ({ previousPeriodGroup: dataArr, previousPeriodGroupIsLoading: false }));
          return { data, error: res.error };
        },
        setClasses: async (myClasses) =>
          await set((s) => ({
            myClasses: typeof myClasses === 'function' ? myClasses(s.myClasses) : myClasses,
          })),
        getMyClasses: async (body: QueriesDto, signal?) => {
          const fPeriod = body.period || get().selectedPeriod;
          const fSchoolYear = body.schoolYear || get().selectedSchoolYear;
          if (fPeriod == null || fSchoolYear == null) {
            await set(() => ({
              myClasses: initialState.myClasses,
            }));
            await get().reset();
          }
          await set(() => ({ classesIsLoading: true }));
          const res = await getMyClasses(body.period, body.schoolYear, signal);
          const data = (res.data && res.data) || initialState.myClasses;
          await set(() => ({ myClasses: data, classesIsLoading: false }));
          await set(() => ({
            classesIsLoading: false,
          }));
          return { data, error: res.error };
        },
        setClassDetails: (classDetails) => set(() => ({ classDetails })),
        getClassDetails: async (groupId: string, period: string) => {
          const classDetails = get().classDetails;
          const details = emptyMyGroup;
          const myClasses = get().myClasses;
          if (myClasses) {
            myClasses.forEach((c) => {
              if (c.groupId === groupId && c.forecastPeriod === period) {
                Object.assign(details, c);
              }
            });
            set(() => ({ classDetails: details }));
          }
          return { data: classDetails };
        },
        setMentorClass: async (mentorClass) =>
          await set((s) => ({
            mentorClass: typeof mentorClass === 'function' ? mentorClass(s.mentorClass) : mentorClass,
          })),
        setMentorClassGrid: async (mentorClassGrid) =>
          await set((s) => ({
            mentorClassGrid:
              typeof mentorClassGrid === 'function' ? mentorClassGrid(s.mentorClassGrid) : mentorClassGrid,
          })),
        getMentorClass: async (groupId: string, queries: QueriesDto, user, signal?) => {
          const fPeriod = queries.period || get().selectedPeriod;
          const fSchoolYear = queries.schoolYear || get().selectedSchoolYear;
          const dataArr = [];
          if (groupId == null) {
            set(() => ({
              mentorClass: initialState.mentorClass,
              mentorClassGrid: initialState.mentorClassGrid,
            }));

            await get().reset();
          }
          await set(() => ({ mentorClassIsLoading: true }));

          let res;
          let data;
          if (user && hasRolePermission(user).mentor) {
            const res = await getMentorClassGrid(groupId, fPeriod, fSchoolYear, signal);
            data = (res.data && res.data) || initialState.mentorClass;
            await set(() => ({
              mentorClassGrid: data,
              mentorClassIsLoading: false,
            }));
          } else {
            const res = await getMentorClass(groupId, fPeriod, fSchoolYear, signal);
            data = (res.data && res.data) || initialState.mentorClass;

            data.map((d) => {
              const img = apiURL(`/education/${d.pupil}/personimage?width=${68}`);
              dataArr.push({
                ...d,
                image: img.length === 0 || !img ? null : img,
              });
            });

            await set(() => ({
              mentorClass: dataArr,
              mentorClassIsLoading: false,
            }));
          }

          return { data, error: res?.error };
        },
        setAllPupils: async (allPupils) =>
          await set((s) => ({
            allPupils: typeof allPupils === 'function' ? allPupils(s.allPupils) : allPupils,
          })),
        getAllPupils: async (queries: QueriesDto, signal?) => {
          const fPeriod = queries.period || get().selectedPeriod;
          const fSchoolYear = queries.schoolYear || get().selectedSchoolYear;
          const dataArr = [];
          if (fPeriod == null || fSchoolYear == null) {
            await set(() => ({
              allPupils: initialState.allPupils,
            }));
            await get().reset();
          }
          await set(() => ({ pupilsIsLoading: true }));
          const res = await getAllPupils(fPeriod, fSchoolYear, signal);
          const data = (res.data && res.data) || initialState.allPupils;

          data.map((d) => {
            const img = apiURL(`/education/${d.pupil}/personimage?width=${68}`);
            dataArr.push({
              ...d,
              image: img.length === 0 || !img ? null : img,
            });
          });

          await set(() => ({
            allPupils: dataArr,
            pupilsIsLoading: false,
          }));
          return { data, error: res.error };
        },
        setPupil: async (pupil) =>
          await set((s) => ({
            pupil: typeof pupil === 'function' ? pupil(s.pupil) : pupil,
          })),
        getPupil: async (pupilId: string, period: string, schoolYear: number, signal?) => {
          if (pupilId == null) {
            await set(() => ({
              pupil: initialState.pupil,
            }));
            await get().reset();
          }
          await set(() => ({ singlePupilIsLoading: true }));
          const res = await getPupil(pupilId, period, schoolYear, signal);
          const data = (res.data && res.data) || initialState.pupil;
          await set(() => ({ pupil: data, singlePupilIsLoading: false }));
          // await get().getMentorClass(data[0].classGroupId, {
          //   period: get().selectedPeriod,
          //   schoolYear: get().selectedSchoolYear,
          // });
          return { data, error: res.error };
        },
        setForecast: async (forecast: SetForecastDto) => {
          const res = await setForecast(forecast);
          if (!res.error) {
            await get().getGroupWithPupils(forecast.groupId, {
              period: forecast.period,
              schoolYear: forecast.schoolYear,
            });
          }
          return { data: res.data };
        },
        copyPreviousForecast: async (forecast: CopyPreviousForecastDto) => {
          const res = await copyPreviousForecast(forecast);
          const subject = get().group;
          if (!res.error) {
            await get().getGroupWithPupils(subject.groupId, {
              period: get().selectedPeriod,
              schoolYear: get().selectedSchoolYear,
            });
          }
          return { data: res.data, message: res.message };
        },
        clearGroupForecasts: async (forecast: clearGroupForecastsDto) => {
          const res = await clearGroupForecasts(forecast.groupId, forecast.period, forecast.schoolYear);
          const subject = get().group;
          if (!res.error) {
            await get().getGroupWithPupils(subject.groupId, {
              period: subject.forecastPeriod,
              schoolYear: forecast.schoolYear,
            });
          }
          return { data: res.data };
        },
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'forecast-storage',
        version: 1,
        partialize: ({ selectedSchoolYear, selectedPeriod }) => ({
          selectedSchoolYear,
          selectedPeriod,
        }),
      }
    ),
    { enabled: __DEV__ }
  )
);
