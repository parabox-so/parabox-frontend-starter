import { ApiResponse, RequestConfig, ApiError } from './types';
import { handleResponseError } from './interceptors';

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: () => Promise<string | null>;
  getWorkspaceId?: () => string | null;
  defaultHeaders?: Record<string, string>;
}

export class ParaboxApiClient {
  private baseUrl: string;
  private getToken?: () => Promise<string | null>;
  private getWorkspaceId?: () => string | null;
  private defaultHeaders: Record<string, string>;

  constructor(options?: ApiClientOptions) {
    this.baseUrl =
      options?.baseUrl ||
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:8080/api/v1');
    this.getToken = options?.getToken;
    this.getWorkspaceId = options?.getWorkspaceId;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.defaultHeaders,
    };
  }

  public setTokenProvider(provider: () => Promise<string | null>) {
    this.getToken = provider;
  }

  public setWorkspaceProvider(provider: () => string | null) {
    this.getWorkspaceId = provider;
  }

  private async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
    );

    if (config.params) {
      Object.entries(config.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      });
    }

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(config.headers as Record<string, string>),
    };

    // Inject Bearer token
    if (!config.skipAuth && this.getToken) {
      try {
        const token = await this.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Failed to retrieve auth token for request:', err);
      }
    }

    // Inject Workspace ID header
    if (!config.skipWorkspaceHeader && this.getWorkspaceId) {
      const wsId = this.getWorkspaceId();
      if (wsId) {
        headers['x-workspace-id'] = wsId;
      }
    }

    try {
      const response = await fetch(url.toString(), {
        ...config,
        headers,
      });

      let responseData: any = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw handleResponseError(response.status, responseData);
      }

      return {
        data: responseData?.data !== undefined ? responseData.data : responseData,
        status: response.status,
        message: responseData?.message,
        meta: responseData?.meta,
      };
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err.message || 'Network request failed', 0, 'NETWORK_ERROR');
    }
  }

  public async get<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async patch<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const createApiClient = (options?: ApiClientOptions) => new ParaboxApiClient(options);

export const apiClient = new ParaboxApiClient();
