import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors';
import { logger } from '../logger';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  if (err instanceof AppError) {
    logger.warn({ err }, 'Handled application error');
    return res.status(err.status).json({ code: err.code, message: err.message });
  }

  if (err instanceof ZodError) {
    logger.warn({ err }, 'Validation error');
    return res.status(400).json({
      code: 'invalid_input',
      message: 'Payload validation failed',
      issues: err.issues,
    });
  }

  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ code: 'internal_error', message: 'Unexpected server error' });
};

export const notFoundHandler = (_req: Request, res: Response): Response =>
  res.status(404).json({ code: 'not_found', message: 'Route not found' });
