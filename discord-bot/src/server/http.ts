import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { logger } from '../shared/logger';

export function createHttpServer() {
  const app = express();
  app.use(helmet());
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    const id = (req.headers['x-request-id'] as string) || randomUUID();
    res.setHeader('x-request-id', id);
    (req as any).id = id;
    next();
  });
  app.use(pinoHttp({ logger, customProps: (req) => ({ requestId: (req as any).id }) }));
  app.use('/api', cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());
  const limiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7' });
  app.use(['/api'], (req, res, next) => {
    if (req.method === 'GET' || req.method === 'OPTIONS') return next();
    return limiter(req, res, next);
  });
  app.get('/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));
  return app;
}

