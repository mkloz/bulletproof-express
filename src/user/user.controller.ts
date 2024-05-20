import { User } from './user.entity';
import { userService } from './user.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UpdateUserDtoValidator } from './user.dto';
import { parseAuthToken } from '../auth/login.midleware';

export class UserController {
  public static async get(req: Request, res: Response): Promise<User> {
    const { userId } = parseAuthToken(req);
    const task = await userService.get({ id: userId });

    task.password = undefined;
    res.status(StatusCodes.OK).json(task);

    return task;
  }

  public static async update(req: Request, res: Response): Promise<User> {
    const { userId } = parseAuthToken(req);
    const data = UpdateUserDtoValidator.parse(req.body);
    const task = await userService.update(userId, data);

    task.password = undefined;
    res.status(StatusCodes.OK).json(task);

    return task;
  }

  public static async delete(req: Request, res: Response): Promise<User> {
    const { userId } = parseAuthToken(req);
    const task = await userService.delete(userId);

    task.password = undefined;
    res.status(StatusCodes.OK).json(task);

    return task;
  }
}
