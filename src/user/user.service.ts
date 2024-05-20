import { User } from './user.entity';
import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../db/prisma.client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../utils/exeptions/exeptions';
import { compareSync, hashSync } from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './user.dto';

export class UserService {
  private static userNotExistExeption = new NotFoundException(
    'User does not exist.',
  );

  constructor(private readonly prisma: PrismaClient) {}

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    if (dto.password) dto.password = UserService.hash(dto.password);

    const task = await this.prisma.user.update({ where: { id }, data: dto });
    if (!task) {
      throw UserService.userNotExistExeption;
    }

    return new User(task);
  }

  async delete(id: number): Promise<User> {
    const task = await this.prisma.user.delete({ where: { id } });

    if (!task) {
      throw UserService.userNotExistExeption;
    }

    return new User(task);
  }

  public static compare(pass: string, hash: string): boolean {
    return compareSync(pass, hash);
  }

  public static hash(string: string): string {
    return hashSync(string);
  }

  async create(dto: CreateUserDto): Promise<User> {
    dto.password = UserService.hash(dto.password);

    const task = await this.prisma.user.create({ data: dto });

    if (!task) {
      throw new InternalServerErrorException('Cant create user.');
    }

    return new User(task);
  }

  async get(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const task = await this.prisma.user.findUnique({ where });

    if (!task) {
      throw UserService.userNotExistExeption;
    }

    return new User(task);
  }
  async getSafe(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const task = await this.prisma.user.findUnique({ where });

    return task ? new User(task) : null;
  }
}

export const userService = new UserService(prisma);
