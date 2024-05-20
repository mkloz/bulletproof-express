import { Task } from './task.entity';
import { PrismaClient } from '@prisma/client';
import {
  Paginated,
  PaginationOptionsDto,
  Paginator,
} from '../shared/pagination';
import { prisma } from '../db/prisma.client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../utils/exeptions/exeptions';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

export class TaskService {
  constructor(private readonly prisma: PrismaClient) {}

  async getMany(
    userId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Task>> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: tasks.map((task) => new Task(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.task.count({ where: { userId } }),
    });
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({ where: { id }, data: dto });

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    return new Task(task);
  }

  async delete(id: number): Promise<Task> {
    const task = await this.prisma.task.delete({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    return new Task(task);
  }

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({ data: { userId, ...dto } });

    if (!task) {
      throw new InternalServerErrorException('Cant create task.');
    }

    return new Task(task);
  }

  async get(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    return new Task(task);
  }
}

export const tasksService = new TaskService(prisma);
