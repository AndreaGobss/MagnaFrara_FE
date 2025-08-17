export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: { [key: string]: string[] };
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

// Type guards per controllare il tipo di risposta
export function isApiErrorResponse(response: any): response is ApiErrorResponse {
  return response && response.success === false && response.error;
}

export function isApiSuccessResponse<T>(response: any): response is ApiResponse<T> {
  return response && response.success === true;
}

// Tipi per errori comuni
export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'INTERNAL_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN';
