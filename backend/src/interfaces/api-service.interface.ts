export interface ApiResponse<T> {
  data: T;
  message: string;
}

export default ApiResponse;

export type EmptyResponse = ApiResponse<Record<string, never>>;
