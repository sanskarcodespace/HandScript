/**
 * Utility: Async error wrapper
 * Catches rejected promises in controllers and passes them to next(err)
 */
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
