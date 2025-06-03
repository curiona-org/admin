import { refreshSessionAction } from "@/app/(auth)/actions";
import { auth } from "@/lib/auth";
import config from "@/lib/config";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export type Filters = {
  page: number;
  limit: number;
  search?: string;
  order_by?: "newest" | "oldest";
};

export function filtersToQueryString(filters: Filters): string {
  const params = new URLSearchParams();
  params.set("page", filters.page.toString());
  params.set("limit", filters.limit.toString());
  if (filters.search) params.set("search", filters.search);
  if (filters.order_by) params.set("order_by", filters.order_by);
  return params.toString();
}

export type APIResponse<T = Record<string, unknown>> = {
  success: boolean;
  message: string;
  data: T;
  error?: ValidationError[] | string;
};

export type ValidationError = {
  field: string;
  message: string;
};

export class APIService {
  protected baseURL: string;
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
    });
    this.attachInterceptors();
  }

  async get<T = unknown>(
    url: string,
    params = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.get<APIResponse<T>>(url, { params, ...config });
  }

  async post<T = unknown>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.post<APIResponse<T>>(url, data, config);
  }

  async put<T = unknown>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.put<APIResponse<T>>(url, data, config);
  }

  async delete<T = unknown>(url: string, config: AxiosRequestConfig = {}) {
    return this.instance.delete<APIResponse<T>>(url, config);
  }

  async patch<T = unknown>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.instance.patch<APIResponse<T>>(url, data, config);
  }

  async request<T = unknown>(config: AxiosRequestConfig) {
    return this.instance.request<APIResponse<T>>(config);
  }

  private attachInterceptors() {
    this.instance.interceptors.request.use(async (request) => {
      if (!this.isAuthorizationAttached()) {
        const session = await auth();
        if (session?.tokens) {
          const authorization = `Bearer ${session.tokens.access_token}`;
          request.headers["Authorization"] = authorization;

          this.instance.defaults.headers.common["Authorization"] =
            authorization;
        }
      }
      return request;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const refreshResult = await refreshSessionAction();

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${refreshResult.data?.access_token}`;

          this.instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refreshResult.data?.access_token}`;
          return this.instance(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  private isAuthorizationAttached() {
    const authHeader = this.instance.defaults.headers.common["Authorization"];
    if (authHeader === null || authHeader === undefined || authHeader === "")
      return false;
    else return true;
  }
}

export const apiClient = new APIService(
  config.BACKEND_URL || "http://localhost:3000/api"
);
