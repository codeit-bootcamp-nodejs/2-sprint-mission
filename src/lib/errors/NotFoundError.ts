// src/lib/errors/NotFoundError.ts
class NotFoundError extends Error {
  status: number;

  constructor(modelName: string, id?: number | string) {
    super(`${modelName} with id ${id} not found`);
    this.name = 'NotFoundError';
    this.status = 404; // HTTP 404 Not Found
  }
}

export default NotFoundError;

