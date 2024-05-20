import { Router } from 'express';
import { TaskController } from './task.controller';
import { authTaskBelongsToUser } from './task-belong-to-user.midleware';
import { auth } from '../auth/login.midleware';

export const taskRouter = Router();

taskRouter
  .get('/tasks/:id', authTaskBelongsToUser, TaskController.get)
  .post('/tasks', auth, TaskController.create)
  .patch('/tasks/:id', authTaskBelongsToUser, TaskController.update)
  .delete('/tasks/:id', authTaskBelongsToUser, TaskController.delete)
  .get('/tasks', auth, TaskController.getMany);
