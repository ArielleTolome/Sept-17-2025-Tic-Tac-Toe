import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from './logger';
import { connect, getDB, listPlayers, createSnapshot, listSnapshots, getSnapshot } from './db';
import { poll } from './poller';

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
app.use(pinoHttp({ logger, customProps: (req) => ({ requestId: (req as any).id }) }));

// CORS on API
const allowed = process.env.ALLOWED_ORIGIN || 'http://localhost:5178';
app.use('/api', cors({ origin: allowed }));
app.use(express.json());

// Rate limits on mutating
const limiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7' });
app.use(['/api'], (req, res, next) => {
  if (req.method === 'GET' || req.method === 'OPTIONS') return next();
  return limiter(req, res, next);
});

// Health
app.get('/healthz', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Connect DB
connect(process.env.DATABASE_URL);

// API
app.get('/api/leaderboard', (_req, res) => {
  res.json({ rows: listPlayers() });
});

app.get('/api/leaderboard.csv', (_req, res) => {
  const rows = listPlayers();
  const header = 'rank,name,elo,games,wins,losses,draws\n';
  const body = rows.map((r, i) => `${i+1},${csv(r.name)},${Math.round(r.elo)},${r.games},${r.wins},${r.losses},${r.draws}`).join('\n');
  res.setHeader('content-type', 'text/csv');
  res.send(header + body);
});

app.get('/api/snapshots', (_req, res) => {
  res.json({ snapshots: listSnapshots() });
});

app.get('/api/snapshots/:id.csv', (req, res) => {
  const snap = getSnapshot(req.params.id);
  if (!snap) return res.status(404).send('not found');
  const rows = snap.rows as any[];
  const header = 'rank,name,elo,games,wins,losses,draws\n';
  const body = rows.map((r, i) => `${i+1},${csv(r.name)},${Math.round(r.elo)},${r.games},${r.wins},${r.losses},${r.draws}`).join('\n');
  res.setHeader('content-type', 'text/csv');
  res.send(header + body);
});

function csv(s: string) { return '"' + s.replace(/"/g, '""') + '"'; }

// Static client
const clientDir = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientDir));
app.get('*', (_req, res) => res.sendFile(path.join(clientDir, 'index.html')));

const apiBase = process.env.API_BASE_URL || '';
let lastPoll = Date.now() - 3600_000; // 1h back initial
const interval = Number(process.env.POLL_INTERVAL_MS || 60_000);
setInterval(async () => {
  if (!apiBase || process.env.MOCK === '1') return; // skip if mock or no API
  try {
    const count = await poll(apiBase, lastPoll);
    lastPoll = Date.now();
    if (count) logger.info({ count }, 'ingested games');
  } catch (e) {
    logger.warn({ err: e }, 'poll failed');
  }
}, interval);

// Snapshot weekly (configurable via millis)
const snapEvery = Number(process.env.SNAPSHOT_CRON_MS || 7*24*3600_000);
setInterval(() => {
  const id = new Date().toISOString().slice(0,10);
  createSnapshot(id, { rows: listPlayers() });
  logger.info({ id }, 'snapshot created');
}, snapEvery);

const port = Number(process.env.PORT || 4600);
app.listen(port, () => logger.info({ port, allowed }, 'leaderboard aggregator started'));

