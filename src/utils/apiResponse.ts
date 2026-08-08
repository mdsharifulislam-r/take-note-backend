import { Response } from 'express';
import { PaginationMeta } from '../types/utility.types';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export type SendResponseOptions<T> = {
  res: Response;
  data?: T;
  message?: string;
  statusCode?: number;
  pagination?: PaginationMeta;
};

export const sendResponse = <T>({
  res,
  data,
  message = 'Success',
  statusCode = 200,
  pagination,
}: SendResponseOptions<T>): void => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(pagination && { pagination }),
  });
};
