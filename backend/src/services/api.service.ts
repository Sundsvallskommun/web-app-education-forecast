import { HttpException } from '@/exceptions/HttpException';
import { apiURL } from '@/utils/util';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { createApiTokenService } from './api-token.service';
import { IApiTokenService } from '@interfaces/api-token.interface';

class ApiResponse<T> {
  data: T;
  message: string;
}

// Created lazily so the Redis-backed variant is only resolved after initRedis() has run.
let apiTokenService: IApiTokenService | null = null;

function getApiTokenService(): IApiTokenService {
  if (!apiTokenService) {
    apiTokenService = createApiTokenService();
  }
  return apiTokenService;
}

class ApiService {
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const token = await getApiTokenService().getToken();

    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const defaultParams = {};

    const preparedConfig: AxiosRequestConfig = {
      ...config,
      headers: { ...defaultHeaders, ...config.headers },
      params: { ...defaultParams, ...config.params },
      url: apiURL(config.url),
    };

    try {
      const res = await axios(preparedConfig);
      return { data: res.data, message: 'success' };
    } catch (error: unknown | AxiosError) {
      console.log(error);
      if (axios.isAxiosError(error) && (error as AxiosError).response?.status === 404) {
        throw new HttpException(404, 'Not found');
      }
      // NOTE: did you subscribe to the API called?
      throw new HttpException(500, 'Internal server error from gateway');
    }
  }

  public async get<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  public async post<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  public async patch<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }

  public async delete<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }
}

export default ApiService;
