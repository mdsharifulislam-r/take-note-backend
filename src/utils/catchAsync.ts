import { NextFunction, Request, Response, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export const catchAsync = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err: unknown) => {
      next(err);
    });
  };
};
