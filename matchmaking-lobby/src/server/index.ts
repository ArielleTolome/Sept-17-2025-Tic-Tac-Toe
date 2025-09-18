import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { logger } from './logger';
import { initDB } from './db';
import { attachLobby } from './matchmaker';

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

const allowed = process.env.ALLOWED_ORIGIN || 'http://localhost:5175';
app.use('/api', cors({ origin: allowed }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7' });
app.use(['/api'], (req, res, next) => {
  if (req.method === 'GET' || req.method === 'OPTIONS') return next();
  return limiter(req, res, next);
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));

// Static client
const clientDir = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientDir));
app.get('*', (_req, res) => res.sendFile(path.join(clientDir, 'index.html')));

const server = createServer(app);

// DB init
initDB(process.env.DB_PATH);

// Lobby WS
attachLobby(server, process.env.API_BASE_URL || '');

const port = Number(process.env.PORT || 4100);
server.listen(port, () => logger.info({ port, allowed }, 'matchmaking lobby started'));

