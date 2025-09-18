import 'dotenv/config';
import { createServer } from 'node:http';
import { env } from './env';
import { createApp } from './app';
import { logger } from './logger';
import { connectPrisma, prisma } from './prisma';
import { createSocketServer } from './socket';

const start = async (): Promise<void> => {
  await connectPrisma();
  const app = createApp();
  const server = createServer(app);
  createSocketServer(server);

  server.listen(env.PORT, env.HOST, () => {
    logger.info(`API listening on http://${env.HOST}:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Graceful shutdown started');
    server.close(() => {
      logger.info('HTTP server closed');
    });
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
};

start().catch((error) => {
  logger.error({ error }, 'Failed to start server');
  process.exit(1);
});
