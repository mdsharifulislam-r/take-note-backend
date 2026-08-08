import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiResponse';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.') || 'root',
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'A record with that value already exists.',
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format.',
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
};
