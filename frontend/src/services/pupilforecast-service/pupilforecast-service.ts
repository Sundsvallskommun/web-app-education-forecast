import {
  CopyPreviousForecastDto,
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
  MetaPupils,
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

export const getSubjects: (
  schoolId: string,
  periodId: number,
  searchFilter?: string,
  PageNumber?: number,
  PageSize?: number,
  OrderBy?: string,
  OrderDirection?: string,
  signal?: AbortSignal
) => Promise<ServiceResponse<MetaGroup>> = (
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
    .get<ApiResponse<MetaGroup>>(`/pupilforecast/mygroups/${schoolId}`, {
      params: { periodId, groupType: 'G', searchFilter, PageNumber, PageSize, OrderBy, OrderDirection },
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
