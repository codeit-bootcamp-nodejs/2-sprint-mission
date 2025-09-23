import { SuccessResponse, ErrorResponse } from '../types/response.type';

export const successResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});

export const errorResponse = (status: number, message: string): ErrorResponse => ({
  success: false,
  error: {
    status,
    message,
  },
});
