import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export class ValidateMiddleware {
  validate = (schema: AnyZodObject) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        const parsed = await schema.parseAsync({
          body: req.body,
          params: req.params,
          query: req.query,
          cookies: req.cookies,
        });

        if (parsed.body !== undefined) req.body = parsed.body;
        if (parsed.params !== undefined) req.params = parsed.params;
        if (parsed.query !== undefined) req.query = parsed.query;

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}

export const validateMiddleware = new ValidateMiddleware();
