import {
  clearGroupForecastsDto,
  CopyPreviousForecastDto,
  ForeacastQueriesDto,
  MentorClassPupilGrid,
  MetaGroup,
  MetaPupils,
  MyGroup,
  Period,
  Pupil,
  SetForecastDto,
} from '@interfaces/forecast/forecast';
import { ApiResponse, apiService } from '../api-service';
import { ServiceResponse } from '@interfaces/service';
import {
  handleCopyForecast,
  handleGetAllPeriods,
  handleGetManyPupils,
  handleGetMentorClassGrid,
  handleGetMetaGroupResponse,
  handleGetMetapupils,
  handleGetPeriod,
  handleSendForecast,
} from './data-handlers/pupilforecast';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, persist } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';

export const getCurrentPeriod: (schoolType: string) => Promise<ServiceResponse<Period>> = (schoolType) => {
  return apiService
    .get<ApiResponse<Period>>(`/pupilforecast/currentperiod/${schoolType}`)
    .then((res) => ({ data: handleGetPeriod(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getAllPeriods: (schoolType: string) => Promise<ServiceResponse<Period[]>> = (schoolType) => {
  return apiService
    .get<ApiResponse<Period[]>>(`/pupilforecast/allperiods/${schoolType}`)
    .then((res) => ({ data: handleGetAllPeriods(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

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
  schoolId: string,
  OrderBy: string,
  OrderDirection: string,
  PageNumber?: number | null,
  PageSize?: number | null,
  periodId?: number | null,
  searchFilter?: string | null,
  signal?: AbortSignal
) => Promise<ServiceResponse<MetaPupils>> = (
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
  periodId?: number | null
) => Promise<ServiceResponse<MentorClassPupilGrid[]>> = (groupId, periodId) => {
  return apiService
    .get<ApiResponse<MentorClassPupilGrid[]>>(`/pupilforecast/mentorclass/${groupId}/grid`, {
      params: { periodId },
    })
    .then((res) => ({ data: handleGetMentorClassGrid(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getPupil: (
  schoolId: string,
  pupilId: string,
  periodId?: number | null
) => Promise<ServiceResponse<Pupil[]>> = (schoolId, pupilId, periodId) => {
  return apiService
    .get<ApiResponse<Pupil[]>>(`/pupilforecast/${schoolId}/pupil/${pupilId}`, { params: { periodId } })
    .then((res) => ({ data: handleGetManyPupils(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getSubjectWithPupils: (
  groupId: string,
  syllabusId: string,
  periodId?: number | null
) => Promise<ServiceResponse<Pupil[]>> = (groupId, syllabusId, periodId) => {
  return apiService
    .get<ApiResponse<Pupil[]>>(`/pupilforecast/pupilsbygroup/${groupId}/${syllabusId}`, {
      params: { periodId },
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
  currentPeriodIsLoading: boolean;
  allPeriodsIsLoading: boolean;
  subjectsIsLoading: boolean;
  classesIsLoading: boolean;
  mentorClassIsLoading: boolean;
  pupilsIsLoading: boolean;
  singlePupilIsLoading: boolean;
  singleSubjectIsLoading: boolean;
  mySubjects: MetaGroup;
  subject: Pupil[];
  myClasses: MetaGroup;
  mentorClass: MentorClassPupilGrid[];
  classDetails: MyGroup;
  allPupils: MetaPupils;
  pupil: Pupil[];
  selectedPeriod: Period;
  currentPeriod: Period;
  allPeriods: Period[];
  selectedId?: string | null;
}

interface Actions {
  setCurrentPeriod: (currentPeriod: Period) => Promise<unknown>;
  setSelectedPeriod: (selectedPeriod: Period) => Promise<unknown>;
  setSubjects: (mySubjects: MetaGroup | ((prevState: MetaGroup) => MetaGroup)) => Promise<unknown>;
  setClasses: (myClasses: MetaGroup | ((prevState: MetaGroup) => MetaGroup) | undefined) => Promise<unknown>;
  setSingleSubject: (subject: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<unknown>;
  setMentorClass: (
    mentorClass: MentorClassPupilGrid[] | ((prevState: MentorClassPupilGrid[]) => MentorClassPupilGrid[])
  ) => Promise<unknown>;
  setAllPupils: (allPupils: MetaPupils | ((prevState: MetaPupils) => MetaPupils)) => Promise<unknown>;
  setPupil: (pupil: Pupil[] | ((prevState: Pupil[]) => Pupil[])) => Promise<unknown>;

  getCurrentPeriod: (schoolType: string) => Promise<ServiceResponse<Period>>;
  getAllPeriods: (schoolType: string) => Promise<ServiceResponse<Period[]>>;

  getMySubjects: (body: ForeacastQueriesDto) => Promise<ServiceResponse<MetaGroup>>;
  getSubjectWithPupils: (
    groupId: string,
    syllabusId: string,
    periodId?: number | null
  ) => Promise<ServiceResponse<Pupil[]>>;
  getMyClasses: (body: ForeacastQueriesDto) => Promise<ServiceResponse<MetaGroup>>;
  getMentorClass: (groupId: string, periodId?: number | null) => Promise<ServiceResponse<MentorClassPupilGrid[]>>;
  getAllPupils: (queries: ForeacastQueriesDto) => Promise<ServiceResponse<MetaPupils>>;
  getPupil: (pupilId: string, unitId: string, periodId?: number | null) => Promise<ServiceResponse<Pupil[]>>;
  setForecast: (forecast: SetForecastDto, schoolId: string) => Promise<ServiceResponse<object>>;
  copyPreviousForecast: (forecast: CopyPreviousForecastDto, schoolId: string) => Promise<ServiceResponse<object>>;
  clearGroupForecasts: (forecast: clearGroupForecastsDto, schoolId: string) => Promise<ServiceResponse<object>>;
  reset: () => void;
}

const initialState: State = {
  currentPeriodIsLoading: true,
  allPeriodsIsLoading: true,
  subjectsIsLoading: true,
  classesIsLoading: true,
  mentorClassIsLoading: true,
  pupilsIsLoading: true,
  singlePupilIsLoading: true,
  singleSubjectIsLoading: true,
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
  mentorClass: [],
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
  currentPeriod: {
    periodName: '',
    schoolYear: 0,
    periodId: 0,
    startDate: '',
    endDate: '',
  },
  allPeriods: [],
  selectedPeriod: {
    periodName: '',
    schoolYear: 0,
    periodId: 0,
    startDate: '',
    endDate: '',
  },
  selectedId: '',
};

export const usePupilForecastStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        selectedPeriod: Period;
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setSelectedPeriod: async (selectedPeriod) => {
          await set(() => ({
            selectedPeriod: selectedPeriod,
          }));
        },
        setCurrentPeriod: async (currentPeriod) => await set(() => ({ currentPeriod })),
        getCurrentPeriod: async (schoolType) => {
          if (schoolType == null) {
            await set(() => ({
              currentPeriod: initialState.currentPeriod,
            }));
            await get().reset();
          }
          await set(() => ({ currentPeriodIsLoading: true }));
          const res = await getCurrentPeriod(schoolType);
          const data = (res.data && res.data) || initialState.currentPeriod;
          await set(() => ({ currentPeriod: data, currentPeriodIsLoading: false }));

          await set(() => ({
            currentPeriodIsLoading: false,
          }));
          return { data, error: res.error };
        },
        getAllPeriods: async (schoolType) => {
          if (schoolType) {
            await set(() => ({
              allPeriods: initialState.allPeriods,
            }));
            await get().reset();
          }
          await set(() => ({ allPeriodsIsLoading: true }));
          const res = await getAllPeriods(schoolType);
          const data = (res.data && res.data) || initialState.allPeriods;
          await set(() => ({ allPeriods: data, allPeriodsIsLoading: false }));

          await set(() => ({
            allPeriodsIsLoading: false,
          }));
          return { data, error: res.error };
        },
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
        setAllPupils: async (allPupils) =>
          await set((s) => ({
            allPupils: typeof allPupils === 'function' ? allPupils(s.allPupils) : allPupils,
          })),
        getAllPupils: async (queries: ForeacastQueriesDto) => {
          const fPeriod = queries.periodId || get().selectedPeriod;
          const dataArr: Pupil[] = [];
          if (fPeriod == null) {
            await set(() => ({
              allPupils: initialState.allPupils,
            }));
            await get().reset();
          }
          await set(() => ({ pupilsIsLoading: true }));
          const res = await getAllPupils(
            queries.schoolId,
            queries.OrderBy,
            queries.OrderDirection,
            queries.PageNumber,
            queries.PageSize,
            queries.periodId,
            queries.searchFilter
          );
          const data = (res.data && res.data) || initialState.allPupils;

          data.data.map((d) => {
            const img = apiURL(`/education/${d.pupil}/personimage?width=${68}`);
            dataArr.push({
              ...d,
              image: img.length === 0 || !img ? null : img,
            });
          });

          await set(() => ({
            allPupils: {
              pageNumber: data.pageNumber,
              pageSize: data.pageNumber,
              totalPages: data.totalPages,
              totalRecords: data.totalRecords,
              data: dataArr,
            },
            pupilsIsLoading: false,
          }));
          return { data, error: res.error };
        },
        setMentorClass: async (mentorClass) =>
          await set((s) => ({
            mentorClass: typeof mentorClass === 'function' ? mentorClass(s.mentorClass) : mentorClass,
          })),
        getMentorClass: async (groupId: string, periodId?: number | null) => {
          const fPeriod = periodId || get().selectedPeriod;

          if (fPeriod == null) {
            await set(() => ({
              mentorClass: initialState.mentorClass,
            }));
            await get().reset();
          }
          await set(() => ({ mentorClassIsLoading: true }));
          const res = await getMentorClass(groupId, periodId);
          const data = (res.data && res.data) || initialState.mentorClass;
          await set(() => ({ mentorClass: data, mentorClassIsLoading: false }));

          await set(() => ({
            mentorClassIsLoading: false,
          }));
          return { data, error: res.error };
        },
        setSingleSubject: async (subject) =>
          await set((s) => ({
            subject: typeof subject === 'function' ? subject(s.subject) : subject,
          })),
        getSubjectWithPupils: async (groupId: string, syllabusId: string, periodId?: number | null) => {
          const dataArr: Pupil[] = [];
          if (groupId == null) {
            await set(() => ({
              subject: initialState.subject,
            }));
            await get().reset();
          }
          await set(() => ({ singleSubjectIsLoading: true }));
          const res = await getSubjectWithPupils(groupId ?? get().subject[0].groupId ?? '', syllabusId, periodId);

          const data = (res.data && res.data) || initialState.subject;
          data.map((d) => {
            const img = apiURL(`/education/${d.pupil}/personimage?width=${68}`);
            dataArr.push({
              ...d,
              image: img.length === 0 || !img ? null : img,
            });
          });
          await set(() => ({ subject: dataArr, singleSubjectIsLoading: false }));

          await set(() => ({
            singleSubjectIsLoading: false,
          }));

          return { data, error: res.error };
        },
        setPupil: async (pupil) =>
          await set((s) => ({
            pupil: typeof pupil === 'function' ? pupil(s.pupil) : pupil,
          })),
        getPupil: async (schoolId: string, pupilId: string, periodId?: number | null) => {
          if (pupilId == null) {
            await set(() => ({
              pupil: initialState.pupil,
            }));
            await get().reset();
          }
          await set(() => ({ singlePupilIsLoading: true }));
          const res = await getPupil(schoolId, pupilId, periodId);
          const data = (res.data && res.data) || initialState.pupil;
          await set(() => ({ pupil: data, singlePupilIsLoading: false }));
          // await get().getMentorClass(data[0].classGroupId, {
          //   period: get().selectedPeriod,
          //   schoolYear: get().selectedSchoolYear,
          // });
          return { data, error: res.error };
        },
        setForecast: async (forecast: SetForecastDto, schoolId) => {
          const res = await setForecast(forecast);
          if (!res.error) {
            await get().getSubjectWithPupils(forecast.groupId, forecast.syllabusId, get().selectedPeriod.periodId);
            await get().getMySubjects({
              schoolId: schoolId,
              periodId: get().selectedPeriod.periodId,
              OrderDirection: 'ASC',
              OrderBy: 'GroupName',
              PageSize: 100,
            });
          }
          return { data: res.data };
        },
        copyPreviousForecast: async (forecast: CopyPreviousForecastDto, schoolId) => {
          await set(() => ({ singleSubjectIsLoading: true }));
          const res = await copyPreviousForecast(forecast);
          if (!res.error) {
            await get().getSubjectWithPupils(forecast.groupId, forecast.syllabusId, get().selectedPeriod.periodId);
            await get().getMySubjects({
              schoolId: schoolId,
              periodId: get().selectedPeriod.periodId,
              OrderDirection: 'ASC',
              OrderBy: 'GroupName',
              PageSize: 100,
            });
          }
          return { data: res.data, message: res.message };
        },
        clearGroupForecasts: async (forecast: clearGroupForecastsDto, schoolId) => {
          const res = await clearGroupForecasts(forecast.groupId, forecast.syllabusId);
          const subject = get().subject;
          if (!res.error) {
            await get().getSubjectWithPupils(
              subject[0].groupId ? subject[0].groupId : '',
              subject[0].syllabusId ? subject[0].syllabusId : '',
              get().selectedPeriod.periodId
            );
            await get().getMySubjects({
              schoolId: schoolId,
              periodId: get().selectedPeriod.periodId,
              OrderDirection: 'ASC',
              OrderBy: 'GroupName',
              PageSize: 100,
            });
          }
          return { data: res.data };
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
