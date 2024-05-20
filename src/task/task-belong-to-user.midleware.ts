import { NextFunction, Request, Response } from 'express';
import { parseAuthToken } from '../auth/login.midleware';
import { IdDtoValidator } from '../shared/validators/common.validator';
import { tasksService } from './task.service';
import { UnprocessableEntityException } from '../utils/exeptions/exeptions';

export async function authTaskBelongsToUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = IdDtoValidator.parse(req.params);

  if ((await tasksService.get(id)).userId !== parseAuthToken(req).userId) {
    throw new UnprocessableEntityException('Task does not belongs to user');
  }

  next();
}
