import pino, { Logger } from 'pino';
import { env } from './env';

const isDev = env.NODE_ENV !== 'production';

export const logger: Logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
});
