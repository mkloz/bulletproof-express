import { Router } from 'express';
import { UserController } from './user.controller';
import { auth } from '../auth/login.midleware';

export const userRouter = Router();

userRouter
  .get('/users/me', auth, UserController.get)
  .patch('/users/me', auth, UserController.update)
  .delete('/users/me', auth, UserController.delete);
