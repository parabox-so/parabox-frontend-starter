export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  meta?: Record<string, any>;
}

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'PAYMENT_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK_ERROR';

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export class ApiError extends Error {
  public status: number;
  public code: ApiErrorCode;
  public details?: ApiErrorDetail[];
  public requiredPlan?: string;
  public featureLocked?: string;

  constructor(
    message: string,
    status: number,
    code: ApiErrorCode = 'INTERNAL_SERVER_ERROR',
    details?: ApiErrorDetail[],
    extra?: { requiredPlan?: string; featureLocked?: string }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requiredPlan = extra?.requiredPlan;
    this.featureLocked = extra?.featureLocked;
  }
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
  skipWorkspaceHeader?: boolean;
}
