import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from './env';
import { logger } from './logger';
import healthRouter from './routes/health';
import roomsRouter from './routes/rooms';
import gamesRouter from './routes/games';
import leaderboardRouter from './routes/leaderboard';
import docsRouter from './routes/docs';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

export const createApp = () => {
  const app = express();

  app.use(helmet({ crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(compression());
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    }),
  );

  const limiter = rateLimit({
    windowMs: 60_000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/rooms', limiter);

  app.use('/api/health', healthRouter);
  app.use('/api/rooms', roomsRouter);
  app.use('/api/games', gamesRouter);
  app.use('/api/leaderboard', leaderboardRouter);
  app.use('/docs', docsRouter);

  app.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
