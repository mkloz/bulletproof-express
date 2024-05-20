import { ToDoServer } from './app';
import { cs } from './config/api-config.service';
import { startupLogger } from './shared/loggers/logger';

function start() {
  try {
    const server = new ToDoServer();

    server.start(cs.getPort());
  } catch (e) {
    startupLogger.error(e);
    process.exit(1);
  }
}

start();
