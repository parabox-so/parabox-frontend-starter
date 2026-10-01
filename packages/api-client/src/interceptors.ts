import { modalBus } from '@parabox/ui';
import { ApiError, ApiErrorCode } from './types';

export function handleResponseError(status: number, data: any): ApiError {
  let code: ApiErrorCode = 'INTERNAL_SERVER_ERROR';

  switch (status) {
    case 401:
      code = 'UNAUTHORIZED';
      break;
    case 402:
      code = 'PAYMENT_REQUIRED';
      // Intercept 402 Payment Required and trigger Upgrade Modal across the app
      modalBus.emit('UPGRADE_REQUIRED', {
        feature: data?.feature || 'premium_api_access',
        requiredTier: data?.requiredPlan || 'Pro',
        message:
          data?.message ||
          'You have reached the usage limit for this resource. Please upgrade to continue.',
      });
      break;
    case 403:
      code = 'FORBIDDEN';
      break;
    case 404:
      code = 'NOT_FOUND';
      break;
    case 422:
    case 400:
      code = 'VALIDATION_ERROR';
      break;
    case 429:
      code = 'RATE_LIMITED';
      break;
    default:
      code = 'INTERNAL_SERVER_ERROR';
  }

  return new ApiError(
    data?.message || `Request failed with HTTP ${status}`,
    status,
    code,
    data?.details,
    {
      requiredPlan: data?.requiredPlan,
      featureLocked: data?.feature,
    }
  );
}
