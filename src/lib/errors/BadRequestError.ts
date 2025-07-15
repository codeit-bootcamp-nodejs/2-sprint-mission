// src/lib/errors/BadRequestError.ts
class BadRequestError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400; // HTTP 400 Bad Request
  }
}

export default BadRequestError;

