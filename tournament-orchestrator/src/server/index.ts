import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { logger } from './logger';
import { buildRouter } from './routes';
import { makeQueue } from './queueRuntime';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Security
app.use(helmet());
app.disable('x-powered-by');

// Request ID + Logging
app.use((req, res, next) => {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('x-request-id', id);
  (req as any).id = id;
  next();
});
app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({ requestId: (req as any).id })
  })
);

const allowed = process.env.ALLOWED_ORIGIN || 'http://localhost:5174';
app.use('/api', cors({ origin: allowed }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7' });
app.use(['/api'], (req, res, next) => {
  if (req.method === 'GET' || req.method === 'OPTIONS') return next();
  return limiter(req, res, next);
});

// Health
app.get('/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// API routes
const apiBase = process.env.API_BASE_URL || '';
const wsBase = process.env.WS_BASE_URL || '';
const queue = makeQueue(apiBase, wsBase);
app.use('/api', buildRouter({ apiBase, wsBase }));

// Static client
const clientDir = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientDir));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => logger.info({ port, allowed }, 'orchestrator started'));
