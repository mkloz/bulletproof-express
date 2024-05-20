import { Task } from './task.entity';
import { tasksService } from './task.service';
import { Paginated } from '../shared/pagination/paginated.dto';
import { Helper } from '../utils/helpers/helper';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IdDtoValidator } from '../shared/validators/common.validator';
import { CreateTaskDtoValidator, UpdateTaskDtoValidator } from './task.dto';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
import { parseAuthToken } from '../auth/login.midleware';

export class TaskController {
  public static async get(req: Request, res: Response): Promise<Task> {
    const { id } = IdDtoValidator.parse(req.params);
    const task = await tasksService.get(id);

    res.status(StatusCodes.OK).json(task);

    return task;
  }

  public static async create(req: Request, res: Response): Promise<Task> {
    const data = CreateTaskDtoValidator.parse(req.body);
    const { userId } = parseAuthToken(req);
    const task = await tasksService.create(userId, data);

    res.status(StatusCodes.CREATED).json(task);

    return task;
  }

  public static async getMany(
    req: Request,
    res: Response,
  ): Promise<Paginated<Task>> {
    const data = PaginationOptValidator.parse(req.query);
    const { userId } = parseAuthToken(req);
    const task = await tasksService.getMany(
      userId,
      data,
      Helper.getFullUrl(req),
    );

    res.status(StatusCodes.OK).json(task);

    return task;
  }

  public static async update(req: Request, res: Response): Promise<Task> {
    const { id } = IdDtoValidator.parse(req.params);
    const data = UpdateTaskDtoValidator.parse(req.body);
    const task = await tasksService.update(id, data);

    res.status(StatusCodes.OK).json(task);

    return task;
  }

  public static async delete(req: Request, res: Response): Promise<Task> {
    const { id } = IdDtoValidator.parse(req.params);
    const task = await tasksService.delete(id);

    res.status(StatusCodes.OK).json(task);

    return task;
  }
}
