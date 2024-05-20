import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HTTPException, NotFoundException } from './exeptions';
import { cs } from '../../config/api-config.service';
import { Logger } from '../../shared/loggers/logger';
import { ZodError, ZodIssue } from 'zod';

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.join('.');

  return `${pathString}: ${message}`;
};

export class ExceptionResponse {
  status: number;
  message: unknown;
  timestamp: string;
  method: string;
  path?: string;

  constructor(data: Partial<ExceptionResponse>) {
    Object.assign(this, data);
  }
}
const UNKNOWN_EXCEPTION_MESSAGE = 'Something went wrong';

export class ExceptionFilter {
  public static logger = new Logger('ExceptionFilter');
  public static notFoundException = new NotFoundException();

  public static throwNotFound() {
    throw ExceptionFilter.notFoundException;
  }

  public static handle(
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const resp: ExceptionResponse = new ExceptionResponse({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: !cs.isProduction() ? req.path : undefined,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: UNKNOWN_EXCEPTION_MESSAGE,
    });

    if (err) {
      if (err instanceof HTTPException) {
        resp.status = err.statusCode;
        resp.message = err.message;
      } else if (err instanceof ZodError) {
        resp.status = StatusCodes.UNPROCESSABLE_ENTITY;
        resp.message = err.issues.map((err) => formatZodIssue(err)).join('; ');
      } else if (err instanceof Error) {
        if (!cs.isProduction()) {
          resp.message = err.message;
        }
        ExceptionFilter.logger.error(err.message);
      }
    }

    res.status(resp.status).json(resp);
    next();
  }
}
