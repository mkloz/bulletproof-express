require('express-async-errors');
import express, { Application } from 'express';
import { ExceptionFilter } from './utils/exeptions/exeption.filter';
import cors from 'cors';
import { GLOBAL_PREFIX } from './utils/prefix/global-prefix';
import { ApiVersion } from './utils/prefix/version-prefix.enum';
import { AppRouter } from './app.router';
import { requestLogger } from './shared/loggers/request-logger.midleware';
import { startupLogger } from './shared/loggers/logger';

export class ToDoServer {
  private server: Application;

  public constructor() {
    this.server = ToDoServer.create();
  }

  public static create(): Application {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLogger());

    app.use(`/${GLOBAL_PREFIX}/${ApiVersion.FIRST}`, AppRouter.routeV1());

    startupLogger.info('RouterV1 was successfully setted up');

    app.use(ExceptionFilter.throwNotFound);
    app.use(ExceptionFilter.handle);

    startupLogger.info('App was successfully created');

    return app;
  }

  public start(port?: number | string) {
    port = port ? port : process.env.PORT || 3000;

    return this.server.listen(port, () => {
      startupLogger.info(`Server is running on http://localhost:${port}`);
    });
  }
}
