import { Router } from 'express';
import { taskRouter } from './task/task.router';
import { userRouter } from './user/user.router';
import { authRouter } from './auth/auth.router';
import { startupLogger } from './shared/loggers/logger';

export class AppRouter {
  public static routersV1 = {
    taskRouter,
    userRouter,
    authRouter,
  };

  static routeV1(): Router {
    const router: Router = Router();

    for (const [key, value] of Object.entries(AppRouter.routersV1)) {
      router.use(value);
      startupLogger.info(`${key} setted up`);
    }

    return router;
  }
}
