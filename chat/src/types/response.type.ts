export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorDetail {
  status: number;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}
