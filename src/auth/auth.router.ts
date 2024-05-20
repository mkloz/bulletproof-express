import { Router } from 'express';
import { AuthController } from './auth.controller';

export const authRouter = Router()
  .post('/auth/login', AuthController.login)
  .post('/auth/register', AuthController.register)
  .post('/auth/refresh', AuthController.refresh);
