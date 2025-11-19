import { HttpError } from '../types/error.type.js';

export const isErrorInstanceOfHttp = (error) => error instanceof HttpError;
export const isErrorInstanceOfNode = (error) => error instanceof Error;