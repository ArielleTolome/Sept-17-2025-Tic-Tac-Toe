import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { logger } from './logger';
import { attachMockApi, writeMockCache } from './mock';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
app.use('/api', cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5176' }));
app.use(express.json());
const limiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7' });
app.use(['/api'], (req, res, next) => {
  if (req.method === 'GET' || req.method === 'OPTIONS') return next();
  return limiter(req, res, next);
});

app.get('/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Serve static exported dashboard
const clientDir = path.resolve(__dirname, '../../out');
app.use(express.static(clientDir));

// Expose cached analytics JSON
app.use('/cache', express.static(path.resolve(__dirname, './cache')));

// Optional mock API + cache writer for offline
if (process.env.MOCK === '1') {
  attachMockApi(app);
  writeMockCache(path.resolve(__dirname, './cache'));
}

app.get('*', (_req, res) => res.sendFile(path.join(clientDir, 'index.html')));

const port = Number(process.env.PORT || 4200);
app.listen(port, () => logger.info({ port }, 'analytics server started'));

