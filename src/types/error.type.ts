//커스텀 에러 구조, 예외 처리 타입


export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string; // optional: "Bad Request" | "Unauthorized" 등
}
