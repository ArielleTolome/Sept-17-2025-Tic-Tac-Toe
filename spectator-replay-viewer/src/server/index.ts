import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { logger } from './logger';
import { attachMock } from './mock';

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

// CORS for API routes only (when mocking)
const allowed = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use('/api', cors({ origin: allowed }));

// Body parsing
app.use(express.json());

// Rate limiting on mutating routes
const limiter = rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: 'draft-7' });
app.use(['/api', '/webhooks'], (req, res, next) => {
  if (req.method === 'GET' || req.method === 'OPTIONS') return next();
  return limiter(req, res, next);
});

// Health
app.get('/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Static client
const clientDir = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientDir));

// Attach mock API + WS when MOCK=1
const useMock = process.env.MOCK === '1';
const server = app.listen(process.env.PORT || 3000, () => {
  logger.info(
    {
      port: (server.address() as any).port,
      mock: useMock,
      allowedOrigin: allowed
    },
    'server started'
  );
});

if (useMock) {
  attachMock(app, server);
}

// Fallback to index.html for SPA
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

