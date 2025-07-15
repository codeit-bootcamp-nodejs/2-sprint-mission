// src/lib/errors/UnauthorizedError.ts
class UnauthorizedError extends Error {
  status: number;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401; // HTTP 401 Unauthorized
  }
}

export default UnauthorizedError;
