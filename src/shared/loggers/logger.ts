import { Instance as ChalkInstance, Chalk } from 'chalk';
import { cs } from '../../config/api-config.service';

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}
export class Logger {
  constructor(private readonly context: string = Logger.name) {}

  private getCurrentTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  log(level: LogLevel, message: string) {
    const color = new ChalkInstance({ level: cs.isDevelopment() ? 2 : 0 });
    const timestamp = this.getCurrentTimestamp();
    const lc: Chalk =
      {
        INFO: color.green,
        WARNING: color.yellow,
        ERROR: color.red,
      }[level.toUpperCase()] || color.reset;

    const srting = `${lc(color`{blue [${timestamp}]} [${level}] {yellow [APP]} {blue [${this.context}]}: ${message}`)}`;

    console.log(srting);
  }

  info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  warning(message: string) {
    this.log(LogLevel.WARNING, message);
  }

  error(message: string) {
    this.log(LogLevel.ERROR, message);
  }
}
export const logger = new Logger();
export const startupLogger = new Logger('Startup');
