import dotenv from 'dotenv';
import { z } from 'zod';
import { IApiConfig } from './api-config.service';
import { v4 as uuidv4 } from 'uuid';

export enum Env {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

type IEnvConfig = z.infer<typeof EnvSchema>;

export const EnvSchema = z.object({
  PORT: z.coerce.number().nonnegative().default(3000),
  NODE_ENV: z.nativeEnum(Env).default(Env.PRODUCTION),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(6).default(uuidv4()),
  JWT_ACCESS_TOKEN_TIME: z.string().default('30m'),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(6).default(uuidv4()),
  JWT_REFRESH_TOKEN_TIME: z.string().default('7d'),
  DB_PORT: z.coerce.number().nonnegative().min(0).max(65535),
  DB_HOST: z.string().min(2),
  DB_PASS: z.string().min(2),
  DB_USER: z.string().min(1),
  DB_NAME: z.string().min(1),
  DATABASE_URL: z.string().min(8),
});

export class ConfigCreator {
  private config: IApiConfig;

  constructor() {
    dotenv.config();

    const env = this.validate(process.env);

    this.config = this.map(env);
  }

  public validate(config: unknown): IEnvConfig {
    return EnvSchema.parse(config);
  }

  public map(env: IEnvConfig): IApiConfig {
    return {
      env: env.NODE_ENV,
      port: Number(env.PORT),
      jwt: {
        accessToken: {
          secret: env.JWT_ACCESS_TOKEN_SECRET,
          time: env.JWT_ACCESS_TOKEN_TIME,
        },
        refreshToken: {
          secret: env.JWT_REFRESH_TOKEN_SECRET,
          time: env.JWT_REFRESH_TOKEN_TIME,
        },
      },
      database: {
        port: Number(env.DB_PORT),
        host: env.DB_HOST,
        password: env.DB_PASS,
        username: env.DB_USER,
        dbName: env.DB_NAME,
      },
    };
  }

  getConfig(): IApiConfig {
    return this.config;
  }
}
